//---------------------------------------------------------------------------------------------------------------------

var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {

        allItems: {
            inc: [],
            exp: []
        },

        totals: {
            inc: 0,
            exp: 0
        },

        budget: 0,
        percentage: -1
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {
           sum += current.value;
        });

        data.totals[type] = sum;
    };

    return {

        addItem: function (type, des, val) {
            var newItem, id;

            // Create new id
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // New item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }

            // Push into data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var idArray, index;

            idArray = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = idArray.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income of income that was spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(((data.totals.exp / data.totals.inc) * 100));
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function () {
            console.log(data);
        }
    }

})();

//---------------------------------------------------------------------------------------------------------------------

var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if(type === 'inc') {

                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%">\n' +
                    '                            <div class="item__description">%description%</div>\n' +
                    '                            <div class="right clearfix">\n' +
                    '                                <div class="item__value">%value%</div>\n' +
                    '                                <div class="item__delete">\n' +
                    '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>';
            } else if (type === 'exp') {

                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%">\n' +
                    '                            <div class="item__description">%description%</div>\n' +
                    '                            <div class="right clearfix">\n' +
                    '                                <div class="item__value">%value%</div>\n' +
                    '                                <div class="item__percentage">21%</div>\n' +
                    '                                <div class="item__delete">\n' +
                    '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>';
            }

            // Replace placeholder text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
               current.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(dataObj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = dataObj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = dataObj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = dataObj.totalExp;

            if (dataObj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = dataObj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
        },

        getDOMstrings : function () {
            return DOMstrings;
        }
    };

})();

//---------------------------------------------------------------------------------------------------------------------

var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListners = function () {

        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function (event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {

        // Calculate budget
        budgetCtrl.calculateBudget();

        // Return budget
        var budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {

        var input, newItem;

        // Get input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Add item to the UI
            UICtrl.addListItem(newItem, input.type);

            // Clear the input field
            UICtrl.clearFields();

            // Calculate and update budget
            updateBudget();
        }

    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // delete the item from data structure
            budgetCtrl.deleteItem(type, id);

            // delete the item from UI


            // update and show budget
        }

    };
    
    return {
        init: function () {

            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListners();
        }
    }
    
})(budgetController, UIController);

controller.init();