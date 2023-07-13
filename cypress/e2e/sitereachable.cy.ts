describe('Navigation', () => {
    it('should navigate the index page', () => {
        cy.visit('http://localhost:3000')
    })
    it('should navigate the about page', () => {
        cy.visit('http://localhost:3000/about')
    })
    it('should navigate the contact page', () => {
        cy.visit('http://localhost:3000/contact')
    })
})