/// <reference types="cypress" />

import CertificatePage from '../pages_and_components/certificate_page.js';
import CertificateParser from '../pages_and_components/certificate_parser.js';
import {pageAddress, certificates} from './config.js';


describe('task', () => {
  beforeEach(() => {    
    cy.visit(pageAddress);
    let certificatePage = new CertificatePage();
    certificatePage.waitTillPageDownload();
    certificatePage.clickRunProjectButton();
  })


  certificates.forEach((certificate) => {
    it('add certificate', () => {
      let certificatePage = new CertificatePage();
      certificatePage.clickAddButton();
      certificatePage.dragAndDropCertificate(certificate);
      let cParser = new CertificateParser();

      cy.readFile(certificate, 'binary').then((data) => {
        cParser.parseCertificate(data);

        certificatePage.certificateListTable.getItems().then((value) => {
          const listLength = Cypress.$(value).length;
          let addedCertificate = certificatePage.certificateListTable.getItemByindex(listLength - 1);
          const regex = new RegExp(`s*${cParser.subjectCN}s*`);
          addedCertificate.invoke('text').should('match', regex);

          let infoBox = certificatePage.certificateInfoBox;
          infoBox.subjectCNContent.should('have.text', cParser.subjectCN);
          infoBox.issuerCNContent.should('have.text', cParser.issuerCN);
          infoBox.validFromContent.should('have.text', cParser.dateFrom);
          infoBox.validTillContent.should('have.text', cParser.dateTill);
        }); 

        let addedCertificate = certificatePage.certificateListTable.getLastAddedItem();
        const regex = new RegExp(`s*${cParser.subjectCN}s*`);
        addedCertificate.invoke('text').should('match', regex);

        let infoBox = certificatePage.certificateInfoBox;
        infoBox.subjectCNContent.should('have.text', cParser.subjectCN);
        infoBox.issuerCNContent.should('have.text', cParser.issuerCN);
        infoBox.validFromContent.should('have.text', cParser.dateFrom);
        infoBox.validTillContent.should('have.text', cParser.dateTill);
      });

    })
  })
})
  