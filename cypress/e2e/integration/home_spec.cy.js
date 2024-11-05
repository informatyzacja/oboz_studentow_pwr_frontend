// describe('Login', () => {
//     it('logs in successfully', () => {
//         cy.login();
//     });
// });

describe('Home', () => {
    beforeEach(() => {
        cy.session('loginSession', () => {
            cy.login();
        });
    });

    it('shows the home page', () => {
        cy.visit('/');
        cy.contains('Home').should('be.visible');
    });

    it('menu navigation to workshops works', () => {
        cy.visit('/');
        cy.get('.navigation-bar').contains('Warsztaty').should('be.visible').click();
        cy.get('h1').contains('Warsztaty').should('be.visible');
    });

    it('menu navigation to schedule works', () => {
        cy.visit('/');
        cy.get('.navigation-bar').contains('Harmonogram').should('be.visible').click();
        cy.get('h1').contains('Harmonogram').should('be.visible');
    });

    it('menu navigation to sos works', () => {
        cy.visit('/');
        cy.get('.navigation-bar').contains('SOS').should('be.visible').click();
        cy.get('h1').contains('SOS').should('be.visible');
    })

    it('menu navigation to chats works', () => {
        cy.visit('/');
        cy.get('.navigation-bar').contains('Czaty').should('be.visible').click();
        cy.get('h1').contains('Czaty').should('be.visible');
    })

    it('navigation to profile works', () => {
        cy.visit('/');
        cy.get('.header').get('.profile-circle').should('be.visible').click();
        cy.get('h1').contains('Profil').should('be.visible');
    });

});