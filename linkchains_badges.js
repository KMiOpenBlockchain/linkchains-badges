const jsonld = require('jsonld');
const streamifier = require("streamifier");
const pngitxt = require("png-itxt");


// how to override the default document loader with a custom one -- for
// example, one that uses pre-loaded contexts:

// define a mapping of context URL => context doc
const CONTEXTS = {
    "https://w3id.org/openbadges/v2": {
        "@context": {
            "id": "@id",
            "type": "@type",

            "extensions": "https://w3id.org/openbadges/extensions#",
            "obi": "https://w3id.org/openbadges#",
            "validation": "obi:validation",

            "cred": "https://w3id.org/credentials#",
            "dc": "http://purl.org/dc/terms/",
            "schema": "http://schema.org/",
            "sec": "https://w3id.org/security#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",

            "AlignmentObject": "schema:AlignmentObject",
            "CryptographicKey": "sec:Key",
            "Endorsement": "cred:Credential",

            "Assertion": "obi:Assertion",
            "BadgeClass": "obi:BadgeClass",
            "Criteria": "obi:Criteria",
            "Evidence": "obi:Evidence",
            "Extension": "obi:Extension",
            "FrameValidation": "obi:FrameValidation",
            "IdentityObject": "obi:IdentityObject",
            "Image": "obi:Image",
            "HostedBadge": "obi:HostedBadge",
            "hosted": "obi:HostedBadge",
            "Issuer": "obi:Issuer",
            "Profile": "obi:Profile",
            "RevocationList": "obi:RevocationList",
            "SignedBadge": "obi:SignedBadge",
            "signed": "obi:SignedBadge",
            "TypeValidation": "obi:TypeValidation",
            "VerificationObject": "obi:VerificationObject",

            "author": {"@id": "schema:author", "@type": "@id"},
            "caption": {"@id": "schema:caption"},
            "claim": {"@id": "cred:claim", "@type": "@id"},
            "created": {"@id": "dc:created", "@type": "xsd:dateTime"},
            "creator": {"@id": "dc:creator", "@type": "@id"},
            "description": {"@id": "schema:description"},
            "email": {"@id": "schema:email"},
            "endorsement": {"@id": "cred:credential", "@type": "@id"},
            "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
            "genre": {"@id": "schema:genre"},
            "image": {"@id": "schema:image", "@type": "@id"},
            "name": {"@id": "schema:name"},
            "owner": {"@id": "sec:owner", "@type": "@id"},
            "publicKey": {"@id": "sec:publicKey", "@type": "@id"},
            "publicKeyPem": {"@id": "sec:publicKeyPem"},
            "related": {"@id": "dc:relation", "@type": "@id"},
            "startsWith": {"@id": "http://purl.org/dqm-vocabulary/v1/dqm#startsWith"},
            "tags": {"@id": "schema:keywords"},
            "targetDescription": {"@id": "schema:targetDescription"},
            "targetFramework": {"@id": "schema:targetFramework"},
            "targetName": {"@id": "schema:targetName"},
            "targetUrl": {"@id": "schema:targetUrl"},
            "telephone": {"@id": "schema:telephone"},
            "url": {"@id": "schema:url", "@type": "@id"},
            "version": {"@id": "schema:version"},

            "alignment": {"@id": "obi:alignment", "@type": "@id"},
            "allowedOrigins": {"@id": "obi:allowedOrigins"},
            "audience": {"@id": "obi:audience"},
            "badge": {"@id": "obi:badge", "@type": "@id"},
            "criteria": {"@id": "obi:criteria", "@type": "@id"},
            "endorsementComment": {"@id": "obi:endorsementComment"},
            "evidence": {"@id": "obi:evidence", "@type": "@id"},
            "hashed": {"@id": "obi:hashed", "@type": "xsd:boolean"},
            "identity": {"@id": "obi:identityHash"},
            "issuedOn": {"@id": "obi:issueDate", "@type": "xsd:dateTime"},
            "issuer": {"@id": "obi:issuer", "@type": "@id"},
            "narrative": {"@id": "obi:narrative"},
            "recipient": {"@id": "obi:recipient", "@type": "@id"},
            "revocationList": {"@id": "obi:revocationList", "@type": "@id"},
            "revocationReason": {"@id": "obi:revocationReason"},
            "revoked": {"@id": "obi:revoked", "@type": "xsd:boolean"},
            "revokedAssertions": {"@id": "obi:revoked"},
            "salt": {"@id": "obi:salt"},
            "targetCode": {"@id": "obi:targetCode"},
            "uid": {"@id": "obi:uid"},
            "validatesType": "obi:validatesType",
            "validationFrame": "obi:validationFrame",
            "validationSchema": "obi:validationSchema",
            "verification": {"@id": "obi:verify", "@type": "@id"},
            "verificationProperty": {"@id": "obi:verificationProperty"},
            "verify": "verification"
        }
    }
};

var documentLoader;
if (typeof XMLHttpRequest !== 'undefined') {
    documentLoader = jsonld.documentLoaders.xhr()
} else {
    documentLoader = jsonld.documentLoaders.node();
}

// change the default document loader
const customLoader = async (url, options) => {
    if (url in CONTEXTS) {
        return {
            contextUrl: null, // this is for a context via a link header
            document: CONTEXTS[url], // this is the actual document that was loaded
            documentUrl: url // this is the actual context URL after redirects
        };
    }
    // call the default documentLoader
    return documentLoader(url);
};
jsonld.documentLoader = customLoader;

const linkchains = require('linkchains-merkle/linkchains.js');

const assertion_template = {
    "@context": [
        "https://w3id.org/openbadges/v2",
        {
            "@vocab": "https://blockchain.open.ac.uk/vocab/"
        }
    ],
    "type": "Assertion",
    "recipient": {
        "type": "email",
        "hashed": true,
        "salt": "deadsea"
    }
};

const badge_template = {
    "@context": [
        "https://w3id.org/openbadges/v2",
        {
            "@vocab": "https://blockchain.open.ac.uk/vocab/"
        }
    ],
    "type": "BadgeClass",
    "name": "a title",
    "description": "some description",
    "image": "imageurl",
    "version": "version",
    "criteria": {
        "type": "Criteria",
        "narrative": "The holder of this badge has demonstrated the specified skills",
        "skills": "skills"
    },
    "issuer": {
        "type": "Issuer",
        "name": "issuername",
        "description": "issuerdescription"
    }
};

const issued_badge_template = {
    "badge": {
        "@context": [
            "https://w3id.org/openbadges/v2",
            {
                "@vocab": "https://blockchain.open.ac.uk/vocab/"
            }
        ],
        "type": "BadgeClass",
        "name": "a title",
        "description": "some description",
        "image": "imageurl",
        "version": "version",
        "issuer": {
            "type": "Issuer",
            "name": "issuername",
            "description": "issuerdescription",
            "url": "issuerurl",
            "email": "issueremail",
            "telephone": "",
            "image": "issuerimageurl"
        },
        "criteria": {
            "type": "Criteria",
            "narrative": "The holder of this badge has achieved great things in QualiChain",
            "skills": "skills"
        },
        "tags": [
            "decentralisation",
            "blockchain"
        ]
    },
    "recipient": {
        "recipientname": "name of recipient",
        "recipientemail": "email address of the recipient"
    }
};

const templated_used_to_verify = {
    "type" : "MerQLVerification2020"
};

async function createSmartBadge(details) {
    try {
        const badgeTemplate = badge_template;
        var badge = JSON.parse(JSON.stringify(badgeTemplate));
        //console.log(stringify(badge, { space: 4 }));
        if (details.title &&
            details.description &&
            details.issuer &&
            details.issuer.issuername &&
            details.issuer.issuerdescription &&
            details.version &&
            details.imageurl) {
            badge.name = details.title;
            badge.description = details.description;
            badge.image = details.imageurl;
            badge.version = details.version;
            badge.issuer.name = details.issuer.issuername;
            badge.issuer.description = details.issuer.issuerdescription;
        } else {
            throw new Error("Missing parameters");
        }

        if (details.issuer) {
            if (details.issuer.issuerurl) {
                badge.issuer.url = details.issuer.issuerurl;
            }
            if (details.issuer.issuerimageurl) {
                badge.issuer.image = details.issuer.issuerimageurl;
            }
            if (details.issuer.issueremail) {
                badge.issuer.email = details.issuer.issueremail;
            }
            if (details.issuer.issuertelephone) {
                badge.issuer.telephone = details.issuer.issuertelephone;
            }
        }

        if (details.criteria) {
            badge.criteria = details.criteria;
        }
        if (details.skills) {
            badge.criteria.skills = details.skills;
        }
        return badge;
    } catch (error) {
        throw error;
    }
}

async function issueSmartBadge(cfg, details, anchorData) {
    var sha256 = require('js-sha256');
    const assertionTemplate = assertion_template;
    var assertion = JSON.parse(JSON.stringify(assertionTemplate));
    const verificationTemplate = templated_used_to_verify;
    var verification = JSON.parse(JSON.stringify(verificationTemplate));

    //console.log(stringify(assertion, { space : 4 }));
    var badge = details.badge;
    var recipient = details.recipient;

    /* Create assertion */
    assertion.recipient.name = recipient.name;
    assertion.recipient.email = recipient.email;
    delete badge['@context'];
    assertion.badge = badge;

    // Issue timestamp + SHA256 hashing email with salt to get identity
    assertion.issuedOn = Date.now();
    assertion.recipient.identity = 'sha256$' + sha256(recipient.email + recipient.salt);

    //console.log(stringify(assertion, { space: 4 }));
    //console.log(stringify(badge, { space: 4 }));

    var quads = await jsonld.canonize(assertion, {
        algorithm: 'URDNA2015',
        format: 'application/n-quads',
        documentLoader: customLoader
    });
    //console.log(quads);

    /* Pass the badge to the linkchains library to get the metadta */
    var metadata = await linkchains.getVerificationMetadata(assertion, cfg.options);

    /* Call anchor with metadata and get metadata + more */
    var anchoredMetadata = await anchorData(cfg, metadata);

    /* Add verification and signature in the badge */
    // verification template used
    assertion.verification = verification;
    // signature contents comes directly from anchoredMetadata
    assertion.signature = anchoredMetadata.merkletrees.anchor;

    /* Return badge and metadata + more */
    return {
        badge: assertion,
        metadata: anchoredMetadata
    };
}

async function verifySmartBadge(cfg, badge) {
    if (badge.verification.type === "MerQLVerification2020" &&
        badge.signature.type === "ETHMerQL") {
        var metadata = {};
        metadata.anchor = badge.signature;

        metadata.indexhash = badge.signature.indexhash;
        metadata.settings = badge.signature.settings;
        delete metadata.anchor.indexhash;
        delete metadata.anchor.settings;
        delete badge.verification;
        delete badge.signature;

        var options = {
            blockchain: {
                web3: cfg.web3Socket,
                abi: cfg.abi
            }
        };

        var quads = await jsonld.canonize(badge, {
            algorithm: 'URDNA2015',
            format: 'application/n-quads',
            documentLoader: customLoader
        });


        var verifyResult = await linkchains.verify(quads, metadata, options);

        if (typeof (verifyResult.unverified) !== undefined
            && typeof (verifyResult.verified) !== undefined
            && verifyResult.unverified === "") {
            //console.log(stringify(verifyResult, { space : 4 }));
            return true;
        } else {
            return false;
        }
    } else {
        throw new Error("Unsupported badge type");
    }
}

async function addSmartBadgeToImage(png, badge) {
    var streamToString = function (stream) {
        var chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
    };

    var result = await streamToString(streamifier.createReadStream(png)
        .pipe(pngitxt.set({
            keyword: 'openbadges',
            value: badge
        }))
    );
    return result;
}


module.exports = {createSmartBadge, issueSmartBadge, verifySmartBadge, addSmartBadgeToImage};