const itemSelector = 'a[class*="list-group-item"]';

class CertificateListTableComponent{
    constructor(tableElement) {
        this.tableElement = tableElement;
    }

    getTableSize(){
        const elementArray = this.tableElement.get(itemSelector);
        if(Array.isArray(elementArray)){
            return elementArray.length;
        }
        return 1;
    }

    getItemByindex(index){
        return this.tableElement.get(itemSelector).eq(index);
    }

    getLastAddedItem(){
        return this.getItemByindex(this.getTableSize() - 1);
    }
    
}

export default CertificateListTableComponent;