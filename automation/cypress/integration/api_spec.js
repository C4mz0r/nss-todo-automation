describe('API tests', function() {
	
	it('returns a 200 status', function() {
		cy.request('/fake-api-call.php').its('status').should('equal', 200)
	})

	it('has 5 tasks that are completed', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			let completedTasks = json.filter(function(element){
				return element.status == "c"
			});
			expect(completedTasks.length).to.equal(5);
		});
	});
	
	it('has 4 tasks that are not completed', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			let incompletedTasks = json.filter(function(element){
				return element.status == ""
			});
			expect(incompletedTasks.length).to.equal(4);
		});
	});

	it('has 9 tasks in the list', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			expect(json.length).to.equal(9);
		});
	});

	it('has 2 tasks that are category 1', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			let categoryTasks = json.filter(function(element){
				return element.category == "1"
			});		
			expect(categoryTasks.length).to.equal(2);
		});
	});

	it('has no tasks that are category 4', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			let categoryTasks = json.filter(function(element){
				return element.category == "4"
			});		
			expect(categoryTasks.length).to.equal(0);
		});
	});	

	it('has 3 tasks without due dates', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			let dueTasks = json.filter(function(element){
				return element['due date'] == "\r\n"
			});		
			expect(dueTasks.length).to.equal(3);
		});
	});	

	it('has 6 tasks with due dates', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			let dueTasks = json.filter(function(element){
				return element['due date'] !== "\r\n"
			});
			expect(dueTasks.length).to.equal(6);
		});
	});	

	it('has tasks with due dates which can be ordered', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			let dueTasks = json.filter(function(element){
				return element['due date'] !== "\r\n"
			});
			dueTasks.sort(function(a, b){
				return b['due date'] - a['due date']
			});
			console.log(dueTasks);
			// Check that items with dates are correctly ordered
			expect(dueTasks[0]['task name']).to.equal("My new test");
			expect(dueTasks[5]['task name']).to.equal("Modify NSS-TODO");
		});
	});

	it('returns all tasks names', function() {
		cy.request('/fake-api-call.php').then(function(response){
			let json = JSON.parse(response.body);
			let taskNames = json.map(function(element){
				return element['task name'];
			});
			
			let expectedTaskNames = [
				"Download installation <a href=\"https://github.com/amadeuspzs/TODO/archive/NSS-TODO.zip\">zipfile</a>",
				"Finish automation.",
				"Finish reading research papers",
				"Modify NSS-TODO",
				"My new test",
				"Soccer match!",
				"Sprint planning meeting",
				"Test API",
				"test"];

			expectedTaskNames.forEach(function(task){
				expect(taskNames.includes(task)).to.equal(true);
			});
		});
	});

});
