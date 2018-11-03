// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

	// The baseUrl for automation to access the application
	config.baseUrl = 'http://localhost/nss-todo-automation'

	// Directory where the web application is stored on server
	config.applicationFolder = '/opt/lampp/htdocs/nss-todo-automation/'

	// Location of the todo list data files for the running app
	config.todoList = config.applicationFolder + 'todo.list'
	config.categoryList = config.applicationFolder + 'categories.list'

	// Commands to restore the data files to known versions
	// Works for Ubuntu but Windows systems would need to modify the command
	config.resetToDoList = 'cp $(pwd)/cypress/fixtures/todo.list ' + config.todoList
	config.resetCategoryList = 'cp $(pwd)/cypress/fixtures/categories.list ' + config.categoryList

	return config
}
