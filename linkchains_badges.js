const jsonld = require('jsonld');
const fs = require('fs').promises;
const linkchains = require('linkchains-merkle/linkchains.js');


async function createSmartBadgeLibrary(details) {
    try {
        var linkchains_badge_folder = require.resolve('linkchains-badges');
        const badgeTemplate = await fs.readFile('./templates/badge-template.json');
        var badge = JSON.parse(badgeTemplate.toString());
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

async function issueSmartBadgeLibrary(cfg, details, token, anchorData) {
    var sha256 = require('js-sha256');
    const assertionTemplate = await fs.readFile('./templates/assertion-template.json');
    var assertion = JSON.parse(assertionTemplate.toString());
    const verificationTemplate = await fs.readFile('./templates/verification-template.json');
    var verification = JSON.parse(verificationTemplate.toString());

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
    var anchoredMetadata = await anchorData(cfg, token);

    /* Return badge and metadata + more */
    return {
        badge: assertion,
        metadata: anchoredMetadata
    };
}

async function verifySmartBadgeLibrary(cfg, badge) {
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

module.exports = {createSmartBadgeLibrary, issueSmartBadgeLibrary, verifySmartBadgeLibrary};