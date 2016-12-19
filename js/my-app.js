// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.views', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}

$$('#chat-tab-bar').on('click', function() {
    myApp.hideToolbar('.tabbar');
});

$$('#chat-back').on('click', function() {
    myApp.showToolbar('.tabbar');
    $$('#bills-tab').trigger('click');
});

// Conversation flag
var conversationStarted = false;

// Init Messages
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
 
// Init Messagebar
var myMessagebar = myApp.messagebar('.messagebar');
 
$$('.messagebar .link').on('click', function () {
  // Message text
  var messageText = myMessagebar.value().trim();
  // Exit if empy message
  if (messageText.length === 0) return;
 
  // Empty messagebar
  myMessagebar.clear()
 
  // Random message type
  var messageType = (['sent', 'received'])[Math.round(Math.random())];
 
  // Avatar and name for received message
  var avatar, name;
  if(messageType === 'received') {
    avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
    name = 'Kate';
  }
  // Add message
  myMessages.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: messageType,
    // Avatar and name:
    avatar: avatar,
    name: name,
    // Day
    day: !conversationStarted ? 'Today' : false,
    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
  })
 
  // Update conversation flag
  conversationStarted = true;
});    

$$('#incoming-bills .bill').on('click', function () {
    if (!$$(this).hasClass('paid')) {
        var curBill = $$(this);
        var buttons = [
            {
                text: 'Pay Requested Amount',
                onClick: function() {
                    curBill.addClass('paid');
                    var paidText = curBill.find('.amount-paid');
                    $$(paidText).text('Paid');
                }
            },
            {
                text: 'Cancel',
                color: 'red',
            },
        ];

        myApp.actions(buttons);
    }
});

$$('.chores-list').on('click', '.chore', function () {
    var curChore = $$(this);
    var buttons = [
        {
            text: 'Mark Chore Completed',
            onClick: function() {
                curChore.remove();
            }
        },
        {
            text: 'Cancel',
            color: 'red',
        },
    ];

    myApp.actions(buttons);
});

$$('.shopping-list').on('click', '#shopping .shop-item', function () {
    var curItem = $$(this);
    var buttons = [
        {
            text: 'Mark Item Resupplied',
            onClick: function() {
                curItem.remove();
            }
        },
        {
            text: 'Cancel',
            color: 'red',
        },
    ];

    myApp.actions(buttons);
});

$$('.bills-list').on('click', '.paid', function() {
    var curPaid = $$(this);
    var buttons = [
        {
            text: 'Delete Bill',
            onClick: function() {
                curPaid.remove();
            }
        },
        {
            text: 'Cancel',
            color: 'red',
        },
    ];

    myApp.actions(buttons);
});

$$('.add-bill').on('click', function () {
  myApp.popup('.bill-popup');
});

$$('.add-item').on('click', function () {
  myApp.popup('.item-popup');
});

$$('.add-chore').on('click', function () {
  myApp.popup('.chore-popup');
});

var houseMembers = 4;

$$('#split-bill-check').on('change', function() {
    if (this.checked)
        $$('#request-to').val('All');
});

$$('.bill-popup .request-button').on('click', function() {
    var requestTo = jQuery('#request-to').find(":selected").text();
    var requestDue = $$('#request-due').val(); 
    var requestAmount = $$('#request-amount').val();
    var requestSplit = $$('#split-bill-check');
    var requestName = $$('#bill-name').val();

    if (requestSplit.checked) {
        requestAmount /= houseMembers;
    }

    var toAppend = '<li class="card bill">' +
            '<div class="card-header">' + 
                '<div class="col-50">Bill:</div>' + 
                '<div class="col-50">' + requestName + '</div>' +
            '</div>' + 
            '<div class="card-footer">' + 
                '<div class="col-50">From:</div>' + 
                '<div class="col-50">' + requestTo + '</div>' + 
            '</div>' + 
            '<div class="card-footer">' + 
                '<div class="col-50">Due Date:</div>' + 
                '<div class="col-50">' + requestDue + '</div>' + 
            '</div>' + 
            '<div class="card-footer">' + 
                '<div class="col-33">Amount:</div>' + 
                '<div class="col-33 amount-paid"></div>' +
                '<div class="col-33">' + requestAmount + '</div>' +
            '</div>' + 
        '</li>';

    jQuery("#outgoing-bills .bills-list").append(toAppend);
});

$$('.item-popup .request-button').on('click', function() {
    var itemName = $$('#item-name').val();
    var itemQty = $$('#item-qty').val();

    var toAppend = '<li class="card shop-item">' +
        '<div class="card-header">' +
            '<div class="col-50">Item:</div>' +
            '<div class="col-50">' + itemName + '</div>' +
        '</div>' + 
        '<div class="card-footer">' + 
            '<div class="col-50">Qty:</div>' + 
            '<div class="col-50">' + itemQty + '</div>' + 
        '</div>' + 
        '</li>';

    jQuery(".shopping-list").append(toAppend);
});

$$('.chore-popup .request-button').on('click', function() {
    var choreTo = jQuery('#chore-to').find(":selected").text();
    var choreDue = $$('#chore-due').val(); 
    var choreName = $$('#chore-name').val();

    var toAppend = 
        '<li class="card chore">' +
            '<div class="card-header">' +
                '<div class="col-50">Chore:</div>' +
                '<div class="col-50">' + choreName + '</div>' +
            '</div>' +
            '<div class="card-footer">' +
                '<div class="col-50">Assignee:</div>' +
                '<div class="col-50">' + choreTo + '</div>' +
            '</div>' +
            '<div class="card-footer">' +
                '<div class="col-50">Due:</div>' +
                '<div class="col-50">' + choreDue + '</div>' + 
            '</div>' + 
        '</li>';
    jQuery(".chores-list").append(toAppend);
});
