/// <reference types="cypress" />

// Założenia:
// - Istnieje użytkownik testowy używany już w komendzie cy.login()
// - Backend generuje co najmniej jedną aktywną planszę bingo (lub istnieje już w DB)
// - Jeśli brak planszy, test jedynie sprawdza komunikat o braku
// - Upload zdjęcia: używamy fikcyjnego pliku z fixtures

describe('Bingo flow (single scenario)', () => {
  it('Ładuje planszę, dodaje zdjęcie do pierwszego zadania i (jeśli możliwe) wysyła do weryfikacji', () => {
    // używamy istniejącej komendy UI login
    cy.login();
    // po zalogowaniu przechodzimy na widok bingo
    cy.visit('/bingo');

    cy.location('pathname', { timeout: 10000 }).should('include', '/bingo');
    cy.get('.bingo-container', { timeout: 10000 }).should('exist');

    cy.get('body').then(($b) => {
      if ($b.text().includes('Brak aktywnej planszy')) {
        cy.log('Brak planszy – koniec scenariusza');
        return;
      }

      // Upewnij się, że siatka jest
      cy.get('.bingo-grid .bingo-row', { timeout: 8000 }).should('have.length.at.least', 1);

      // Pierwsza komórka
      cy.get('.bingo-cell').first().as('firstCell').click();
      cy.get('.bingo-modal-content', { timeout: 5000 }).should('exist');

      cy.get('body').then(($body) => {
        const modalText = $body.text();
        if (modalText.includes('Zaakceptowane') || modalText.includes('Wysłane')) {
          cy.log('Zadanie już posiada zdjęcie – pomijam upload');
          cy.contains('Zamknij').click();
        } else {
          cy.get('input[type="file"]').selectFile({ contents: Cypress.Buffer.from('stub img'), fileName: 'test.jpg', mimeType: 'image/jpeg' }, { force: true });
          cy.wait(1500);
        }
      });

      // Przycisk wysłania bingo (jeśli aktywny)
      cy.get('body').then(($b2) => {
        if ($b2.find('.submit-bingo-btn').length) {
          cy.get('.submit-bingo-btn').then(($btn) => {
            if (!$btn.is(':disabled') && $btn.text().includes('Wyślij')) {
              cy.wrap($btn).click();
              cy.contains('Status:', { timeout: 5000 }).should('exist');
            } else {
              cy.log('Przycisk nieaktywny – brak pełnej linii');
            }
          });
        }
      });
    });
  });
});
