describe('UI tests', function() {
	beforeEach(function(){
		console.log('Resetting todo list state');
		cy.exec(Cypress.config('resetToDoList'));
		cy.exec(Cypress.config('resetCategoryList'));
	});

	it('add a new task', function() {
				cy.visit('/index.php');
				// TODO...
	});

});
