import { ASN1 } from '@lapo/asn1js';


class CertificateParser{
    constructor(fileName){
        this.fileName = fileName;
        this.data = [];
        this.subjectCN;
        this.issuerCN;
        this.dateFrom;
        this.dateTill;
    }

    parseCertificate(data){
        let asn = ASN1.decode(data);
        this._collectData(asn.sub[0]);

        this.subjectCN = this._parseSubjectCN();
        this.issuerCN = this._parseIssuerCN();
        this.dateFrom = this._parseDateFrom();
        this.dateTill = this._parseDateTill();
    }

    /* this method is copy of toPrettyString(indent) from @lapo/asn1js/asn1.js 
    with update to collect data as array of objects */
    _collectData(asn, indent) {
        if (indent === undefined) indent = '';
        let s = indent;
        if (asn.def) {
            if (asn.def.id)
                s += asn.def.id + ' ';
            if (asn.def.name && asn.def.name != asn.typeName().replace(/_/g, ' '))
                s+= asn.def.name + ' ';
            if (asn.def.mismatch)
                s += '[?] ';
        }
        s += asn.typeName() + ' @' + asn.stream.pos;
        if (asn.length >= 0)
            s += '+';
        s += asn.length;
        if (asn.tag.tagConstructed)
            s += ' (constructed)';
        else if ((asn.tag.isUniversal() && ((asn.tag.tagNumber == 0x03) || (asn.tag.tagNumber == 0x04))) && (asn.sub !== null))
            s += ' (encapsulates)';
        let content = asn.content();
        if (content){
            s += ': ' + content.replace(/\n/g, '|');

            if (asn.typeName() == 'OBJECT_IDENTIFIER' || asn.typeName() == 'UTF8String' || asn.typeName() == 'UTCTime'){
                this.data.push({type: asn.typeName(), content: asn.content()});
            }

        }
        s += '\n';
        if (asn.sub !== null) {
            indent += '  ';
            for (let i = 0, max = asn.sub.length; i < max; ++i)
                s += this._collectData(asn.sub[i], indent, this.data);
        }
    }

    _parseSubjectCN(){
        for(let i = this.data.length - 1; i >=0; i--){
            const item = this.data[i];
            if(item.content.includes('commonName')){
                return this.data[i+1].content;
            }
        }
    }

    _parseIssuerCN(){
        for(let i = 0; i < this.data.length; i++){
            const item = this.data[i];
            if(item.content.includes('commonName')){
                return this.data[i+1].content;
            }
        }
    }

    _parseDateFrom(){
        for(const item of this.data){
            if(item.type == 'UTCTime'){
                const strs = item.content.split(" ");
                return strs[0];
            }
        }
    }

    _parseDateTill(){
        for(let i = this.data.length - 1; i >=0; i--){
            const item = this.data[i];
            if(item.type == 'UTCTime'){
                const strs = item.content.split(" ");
                return strs[0];
            }
        }
    }
}

export default CertificateParser;