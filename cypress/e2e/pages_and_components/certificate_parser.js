// import {readFileSync} from 'fs';
import { ASN1 } from '@lapo/asn1js';


class CertificateParser{
    constructor(fileName){
        this.fileName = fileName;
        this.collected = [];
        this.subjectCN;
        this.issuerCN;
        this.dateFrom;
        this.dateTill;
    }

    parseCertificate(data){
        let asn = ASN1.decode(data);
        this.toPrettyString(asn.sub[0], undefined);
        this.subjectCN = this.getSubjectCN();
        this.issuerCN = this.getIssuerCN();
        this.dateFrom = this.getDateFrom();
        this.dateTill = this.getDateTill();
    }

    toPrettyString(asn, indent) {
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
                this.collected.push({type: asn.typeName(), content: asn.content()});
            }

        }
        s += '\n';
        if (asn.sub !== null) {
            indent += '  ';
            for (let i = 0, max = asn.sub.length; i < max; ++i)
                s += this.toPrettyString(asn.sub[i], indent, this.collected);
        }
    }

    getSubjectCN(){
        for(let i = this.collected.length - 1; i >=0; i--){
            const item = this.collected[i];
            if(item.content.includes('commonName')){
                return this.collected[i+1].content;
            }
        }
    }

    getIssuerCN(){
        for(let i = 0; i < this.collected.length; i++){
            const item = this.collected[i];
            if(item.content.includes('commonName')){
                return this.collected[i+1].content;
            }
        }
    }

    getDateFrom(){
        for(const item of this.collected){
            if(item.type == 'UTCTime'){
                const strs = item.content.split(" ");
                return strs[0];
            }
        }
    }

    getDateTill(){
        for(let i = this.collected.length - 1; i >=0; i--){
            const item = this.collected[i];
            if(item.type == 'UTCTime'){
                const strs = item.content.split(" ");
                return strs[0];
            }
        }
    }
}

export default CertificateParser;