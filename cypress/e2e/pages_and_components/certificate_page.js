const CertificateListTableComponent = require('./certificate_list_table_component.js');
const CertificateInfoBoxComponent = require('./certificate_info_box_component.js');

const runProjectButtonSelector = 'button[onclick]';
const addButtonSelector = 'button[class*="btn-primary"]';
const cancelButtonSelector = 'button[class*="btn-secondary"]';
const addCertificateBoxSelector = 'dropbox[class*="dropbox"]';
const certificateListTableSelector = 'div[class*="list-group"]';
const certificateInfoBoxSelector = 'div[class*="card-body"]';

class CertificatePage{
    get runProjectButton(){
        return cy.get(runProjectButtonSelector);
    }

    get addButton(){
        return cy.get(addButtonSelector);
    }

    get cancelButton(){
        return cy.get(cancelButtonSelector);
    }

    get addCertificateBox(){
        return cy.get(addCertificateBoxSelector);
    }

    get certificateListTable(){
        const element = cy.get(certificateListTableSelector);
        return new CertificateListTableComponent(element);
    }

    get certificateInfoBox(){
        const element =  cy.get(certificateInfoBoxSelector);
        return new CertificateInfoBoxComponent(element);
    }

    clickRunProjectButton(){
        this.runProjectButton.click();
        cy.get(addButtonSelector, {timeout: 6000}).should('be.visible');
    }

    clickAddButton(){
        this.addButton.click();
    }

    clickCancelButton(){
        this.cancelButton.click();
    }

    dragAndDropCertificate(certificateFile){
        this.addCertificateBox.selectFile(certificateFile, {
            action: 'drag-drop'
        });
    }

    waitTillPageDownload(){
        cy.get(runProjectButtonSelector, {timeout: 6000}).should('be.visible');
    }

}

module.exports = CertificatePage;