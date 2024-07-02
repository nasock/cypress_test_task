/// <reference types="cypress" />

const CertificatePage = require('../pages_and_components/certificate_page.js');
const certificate_data = require('/cypress/fixtures/certificates_data.json');
const pageAddress = 'https://js-55fbfg.stackblitz.io';


describe('task', () => {
    beforeEach(() => {
      cy.visit(pageAddress);
      let certificatePage = new CertificatePage();
      certificatePage.waitTillPageDownload();
      certificatePage.clickRunProjectButton();
    })

    certificate_data.forEach((certificate) => {
      it('add certificate', () => {
        let certificatePage = new CertificatePage();
        certificatePage.clickAddButton();
        certificatePage.dragAndDropCertificate(certificate.address);

        let addedCertificate = certificatePage.certificateListTable.getLastAddedItem();
        const regex = new RegExp(`s*${certificate.common_name}s*`);
        addedCertificate.invoke('text').should('match', regex);

        let infoBox = certificatePage.certificateInfoBox;
        infoBox.subjectCNContent.should('have.text', certificate.common_name);
        infoBox.issuerCNContent.should('have.text', certificate.issure_cn);
        infoBox.validFromContent.should('have.text', certificate.valid_from);
        infoBox.validTillContent.should('have.text', certificate.valid_to);
        
      })
    })
})
  