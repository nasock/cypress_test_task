/// <reference types="cypress" />

import CertificatePage from '../pages_and_components/certificate_page.js';
import CertificateParser from '../pages_and_components/certificate_parser.js';

const pageAddress = 'https://js-55fbfg.stackblitz.io';


describe('task', () => {
  beforeEach(() => {    
    cy.visit(pageAddress);
    let certificatePage = new CertificatePage();
    certificatePage.waitTillPageDownload();
    certificatePage.clickRunProjectButton();
  })

  const certificates = [
    "./cypress/fixtures/cert.cer",
    "./cypress/fixtures/cert2.cer",
    "./cypress/fixtures/czo_2017.cer",
    "./cypress/fixtures/ekpp_sign_2014.cer",
    "./cypress/fixtures/idd_2019.cer",
    "./cypress/fixtures/privat_2018.cer",
    "./cypress/fixtures/Нестеренко_Володимир_Борисович_(Тест)-8101916.cer",
    "./cypress/fixtures/Сухаренко_Олег_Андрiйович_(Тест)-8101900.cer",
    "./cypress/fixtures/Таксер Тест Тестович.cer",
    "./cypress/fixtures/Тестувальник Tellipse 1111.cer",
  ];

  certificates.forEach((certificate) => {
    it('add certificate', () => {
      let certificatePage = new CertificatePage();
      certificatePage.clickAddButton();
      certificatePage.dragAndDropCertificate(certificate);
      let cParser = new CertificateParser();

      cy.readFile(certificate, 'binary').then((data) => {
        cParser.parseCertificate(data);

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
  