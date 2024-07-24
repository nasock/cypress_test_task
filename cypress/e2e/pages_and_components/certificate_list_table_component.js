const itemSelector = 'a[class*="list-group-item"]';

class CertificateListTableComponent{
    constructor(tableElement) {
        this.tableElement = tableElement;
    }

    getItems(){
        return this.tableElement.get(itemSelector);
    }

    getItemByindex(index){
        return this.tableElement.get(itemSelector).eq(index);
    }
    
}

export default CertificateListTableComponent;