
describe('Workshops', () => {
    beforeEach(() => {
        cy.session('loginSession', () => {
            cy.login();
        });
    });

    it('shows the workshops page', () => {
        cy.visit('/warsztaty');
        cy.get('h1').contains('Warsztaty').should('be.visible');
    });

    it('can see workshop detail', () => {
        cy.visit('/warsztaty');
        cy.contains('Warsztat 1').should('be.visible').click();
        cy.contains('Opis warsztatu 1').should('be.visible');
    });

    it('can signup and signout', () => {
        cy.visit('/warsztaty');
        cy.contains('Warsztat 1').should('be.visible').click();

        cy.get('body').then(($body) => {
            if ($body.text().includes('Zapisz się')) {
                // User is not signed up
                cy.contains('Zapisz się').should('be.visible').click();
                cy.contains('Jesteś zapisany/a').should('be.visible');
                cy.contains('Wypisz się').should('be.visible').click();
                cy.contains('Zapisz się').should('be.visible');
            } else {
                // User is signed up
                cy.contains('Jesteś zapisany/a').should('be.visible');
                cy.contains('Wypisz się').should('be.visible').click();
                cy.contains('Zapisz się').should('be.visible').click();
                cy.contains('Jesteś zapisany/a').should('be.visible');
            }
        });

    });

});
