describe('Home Page', () => {
    it('logs in successfully', () => {
        cy.visit('/');
        cy.wait(100);

        cy.contains('Zaloguj się').then(($el) => {
            if ($el.is(':visible')) {
                cy.get('input[type="email"]').should('be.visible').type('test@oboz.samorzad.pwr.edu.pl');
                cy.get('button').click();
            }
        });

        cy.get('input[name="verification-code"]').should('be.visible').type('73874544');
    });
});