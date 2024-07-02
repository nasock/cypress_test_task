const contentSelector = 'table[class*="table-borderless"] tbody tr td';

class CertificateInfoBoxComponent{
    constructor(tableElement) {
        this.tableElement = tableElement;
    }

    get subjectCNContent(){
        return this.getContent(0);
    }

    get issuerCNContent(){
        return this.getContent(1);
    }

    get validFromContent(){
        return this.getContent(2);
    }

    get validTillContent(){
        return this.getContent(3);
    }

    getContent(index){
        return this.tableElement.get(contentSelector).eq(index);
    }

}

export default CertificateInfoBoxComponent;