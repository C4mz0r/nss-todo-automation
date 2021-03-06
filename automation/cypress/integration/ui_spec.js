describe('UI tests', function() {
	beforeEach(function(){

		// Reset the data to known defaults
		console.log('Resetting todo list state');
		cy.exec(Cypress.config('resetToDoList'));
		cy.exec(Cypress.config('resetCategoryList'));

		cy.visit('/index.php');

		// Aliased elements		
		cy.get('input[name=data]').as('txtTaskName');
		cy.get('input[value=Add]').as('btnAddTask');
		cy.get('input[value=Remove]').as('btnRemoveTask');
		cy.get('input[value=Complete]').as('btnCompleteTask');
		cy.get('input[name=categorydata]').as('txtCategoryName');
		cy.get('input[value="Add category"]').as('btnAddCategory');
		cy.get('select[name=category]').as('lstCategory');
		cy.get('select[name=colour]').as('lstCategoryColor');
		cy.get('select[name=due_day]').as('lstDueDay');
		cy.get('select[name=due_month]').as('lstDueMonth');
		cy.get('select[name=due_year]').as('lstDueYear');
		cy.get('input[name=allbox]').as('chkToggle');
		cy.get('li').as('taskItems');
	});

	describe('Task Addition', function(){

		it('add a task with no category', function() {
			let taskName = 'Test Task no category';

			// Add the new category
			cy.get('@txtTaskName').type(taskName);
			cy.get('@btnAddTask').click();

			// Confirm that it appears in the list
			expect(cy.get('@taskItems').contains(taskName));
		});

		it('add a task with category', function() {
			let taskName = 'Test Task with category';
			let category = 'Play'

			// Add the new category
			cy.get('@txtTaskName').type(taskName);
			cy.get('@lstCategory').select(category);
			cy.get('@btnAddTask').click();

			// Confirm that it appears in the list
			expect(cy.get('@taskItems').contains(taskName));
			
			// Confirm that it has the correct category
			// Use API since html checking is flaky (i.e. based on text color)
			cy.request('/fake-api-call.php').then(function(response){
				let json = JSON.parse(response.body);
				let task = json.filter(function(element){
					return element['task name'] == taskName;
				});
				// Array, so get first (only) element
				expect(task[0].category).to.equal('3');
			});

		});

		it('add a task with no due date', function() {
			let taskName = 'Test Task with no due date';

			cy.get('@txtTaskName').type(taskName);
			cy.get('@btnAddTask').click();

			// Confirm that it appears in the list and has (None) for due date
			expect(cy.get('@taskItems').contains(taskName).contains('(None)'));
		});

		it('add a task with past due date', function() {
			let taskName = 'Test Task overdue';

			cy.get('@txtTaskName').type(taskName);
			cy.get('@lstDueDay').select('15');
			cy.get('@lstDueMonth').select('Jan');
			cy.get('@lstDueYear').select('2018');
			cy.get('@btnAddTask').click();

			// Confirm that it appears in the list with the due date
			expect(cy.get('@taskItems').contains(taskName).contains('(15/01/18)'));
		});

		it('add a task that exists already shows error message', function() {
			let taskName = 'Finish automation.';

			cy.get('@txtTaskName').type(taskName);
			cy.get('@btnAddTask').click();

			// Confirm that it shows the error message
			expect(cy.get('body').contains('Sorry that TODO item already exists.'));
		});
	});

	describe('Task Completion', function() {
		it('complete a selected task', function() {
			let taskName = 'Finish automation.';

			cy.get('@taskItems').contains(taskName).siblings('input[type=checkbox]').click();
			cy.get('@btnCompleteTask').click();

			// Completed items have a strike
			expect(cy.get('@taskItems').contains(taskName).parent().find('strike'))		
		});

		it('complete multiple tasks at once', function() {
			let taskName = 'Finish automation.';
			cy.get('@taskItems').contains(taskName).siblings('input[type=checkbox]').click();

			let secondTaskName = 'Finish reading research papers';
			cy.get('@taskItems').contains(secondTaskName).siblings('input[type=checkbox]').click();

			cy.get('@btnCompleteTask').click();
		
			// Completed items have a strike
			expect(cy.get('@taskItems').contains(taskName).parent().find('strike'))		
		});

		it('complete a completed task', function() {
			let taskName = 'Soccer match!';

			cy.get('@taskItems').contains(taskName).parent().siblings('input[type=checkbox]').click();
			cy.get('@btnCompleteTask').click();

			// Confirm that it is no longer completed
			// Use API since html checking is flaky
			cy.request('/fake-api-call.php').then(function(response){
				let json = JSON.parse(response.body);
				let task = json.filter(function(element){
					return element['task name'] == taskName;
				});
				// Array, so get first (only) element
				expect(task[0].status).to.not.equal('c');
			});

		});
	});

	describe('Task Removal', function(){

		it('remove a selected task', function() {
			let taskName = 'Soccer match!';

			cy.get('@taskItems').contains(taskName).parent().siblings('input[type=checkbox]').click();
			cy.get('@btnRemoveTask').click();
		
			expect(cy.get('@taskItems').should('have.length', 8));
		});


		it('remove multiple tasks at once', function() {
			let taskName = 'Finish automation.';
			cy.get('@taskItems').contains(taskName).siblings('input[type=checkbox]').click();

			let secondTaskName = 'Finish reading research papers';
			cy.get('@taskItems').contains(secondTaskName).siblings('input[type=checkbox]').click();

			cy.get('@btnRemoveTask').click();
		
			expect(cy.get('@taskItems').should('have.length', 7));
		});

		it('remove all tasks', function() {
			cy.get('@chkToggle').click();
			cy.get('@btnRemoveTask').click();

			expect(cy.get('@taskItems').should('have.length', 0));
		});
	
	});

	describe('Task Editing', function(){		
		it('edit a task name', function(){
			let appendText = '*** Renamed Task ***';
			cy.get('a[title="Edit"]').first().click();
			cy.get('input[name="data"]').type(appendText);
			cy.get('input[value="Update"]').click();
			// Task should have the new text appended on it
			expect(cy.get('@taskItems').contains(appendText));
		});
	});

	describe('Category Management', function(){
		
		it('add a new category without color', function(){
			cy.get('@txtCategoryName').type('new category name');
			cy.get('@lstCategoryColor').select('None');
			cy.get('@btnAddCategory').click();
			expect(cy.get('a[title="Remove this category"]').should('have.length', 5));
		});

		it('add a new category with color', function(){
			cy.get('@txtCategoryName').type('new category name');
			cy.get('@lstCategoryColor').select('Blue');
			cy.get('@btnAddCategory').click();
			expect(cy.get('a[title="Remove this category"]').should('have.length', 5));
		});

		it('add a category that already exists', function(){
			cy.get('@txtCategoryName').type('College');
			cy.get('@btnAddCategory').click();
			// Confirm that it shows the error message
			expect(cy.get('body').contains('The category you want to add already exists'));
		});

		it('remove a category', function(){
			cy.get('a[title="Remove this category"]').first().click();
			cy.get('a[href*="confirm"]').click();
			expect(cy.get('a[title="Remove this category"]').should('have.length', 3));
		});
		
		it('remove a category but then choose nevermind', function(){
			cy.get('a[title="Remove this category"]').first().click();
			cy.get('a[href*="back"]').click();
			expect(cy.get('a[title="Remove this category"]').should('have.length', 4));
		});

		it('remove all categories', function(){
			for(let i=0; i<4; i++) {
				cy.get('a[title="Remove this category"]').first().click();
				cy.get('a[href*="confirm"]').click();
			}
			expect(cy.get('a[title="Remove this category"]').should('have.length', 0));
		});
		

	});

});
