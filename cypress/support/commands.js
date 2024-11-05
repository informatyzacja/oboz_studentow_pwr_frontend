// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    if (err.message.includes('plugin is not implemented on web')) {
        return false
    }
    return true
})

// import { Storage } from '@ionic/storage';

// const storage = new Storage;

// Cypress.Commands.add('enableTutorial', () => {
//     cy.visit('/', {
//         onBeforeLoad() {
//             storage.set('ion_did_tutorial', false)
//         }
//     })
// })

Cypress.Commands.add('login', () => {
    cy.visit('/');
    cy.wait(1000);

    cy.contains('Zaloguj się').then(($el) => {
        if ($el.is(':visible')) {
            cy.get('input[type="email"]').should('be.visible').type('test@oboz.samorzad.pwr.edu.pl');
            cy.get('button').click();
        }
    });

    cy.get('input[name="verification-code"]').should('be.visible').type('73874544');
    cy.wait(1000);
});
