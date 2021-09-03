const jsonld = require('jsonld');
const fs = require('fs').promises;
const linkchains = require('linkchains-merkle/linkchains.js');
const path = require('path');

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
        format: 'application/n-quads'
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
            format: 'application/n-quads'
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

module.exports = {createSmartBadge, issueSmartBadge, verifySmartBadge};