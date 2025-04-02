document.addEventListener("DOMContentLoaded", function() {
  // Get the current page from the URL
  const currentPage = window.location.pathname.split('/').pop().split('.')[0];

  // Run only the code for the current page
  if (currentPage === 'statistics') {
      initStatistics();
  } else if (currentPage === 'books') {
      initBooks();
  } else if (currentPage === 'visitors') {
      initVisitors();
  } else if (currentPage === 'cards') {
      initCards();
  }


// ===================== BOOKS PAGE ================================
function initBooks() {
    // DOM Elements
    const newBookBtn = document.getElementById("new-visitor");
    const newPopup = document.getElementById("newPopup");
    const closeNew = document.getElementById("close-new");
    const addBookBtn = document.getElementById("add-book");
    const bookList = document.getElementById("visitor-list");
    const sortBtn = document.getElementById("sort-btn");
    const sortSelect = document.getElementById("sort");
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search");
    const editPopup = document.getElementById("editPopup");
    const closeEdit = document.getElementById("close-edit");
    const updateBookBtn = document.getElementById("update-book");

    let editIndex = null;
    let currentBooks = [];

    // Initialize the page
    function init() {
        loadBooks();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Debugging: Check if elements exist
        console.log("newBookBtn exists:", newBookBtn !== null);
        console.log("newPopup exists:", newPopup !== null);

        if (newBookBtn) {
            newBookBtn.addEventListener("click", function() {
                console.log("New book button clicked");
                openNewBookPopup();
            });
        }

        if (closeNew) closeNew.addEventListener("click", closeNewBookPopup);
        if (addBookBtn) addBookBtn.addEventListener("click", handleAddBook);
        if (sortBtn) sortBtn.addEventListener("click", handleSort);
        if (searchBtn) searchBtn.addEventListener("click", handleSearch);
        if (closeEdit) closeEdit.addEventListener("click", closeEditBookPopup);
        if (updateBookBtn) updateBookBtn.addEventListener("click", handleUpdateBook);

        if (searchInput) {
            searchInput.addEventListener("keyup", function(e) {
                if (e.key === "Enter") {
                    handleSearch();
                }
            });
        }
    }

    // Open new book popup
    function openNewBookPopup() {
        console.log("Opening new book popup");
        if (newPopup) {
            newPopup.style.display = "flex";
            editIndex = null;
            clearNewBookForm();
        } else {
            console.error("New popup element not found");
        }
    }

    // Close new book popup
    function closeNewBookPopup() {
        if (newPopup) newPopup.style.display = "none";
    }

    // Rest of your book functions remain the same...
    // [Keep all other functions exactly as you had them]

    // Initialize the books page
    init();
}

  // ===================== VISITORS PAGE ================================
  function initVisitors() {
      const newVisitorBtn = document.getElementById("new-visitor");
      const newPopup = document.getElementById("newPopup");
      const closeNew = document.getElementById("close-new");
      const addVisitorBtn = document.getElementById("add-visitor");
      const visitorList = document.getElementById("visitor-list");
      const sortBtn = document.getElementById("sort-btn");
      const sortSelect = document.getElementById("sort");
      const searchBtn = document.getElementById("search-btn");
      const searchInput = document.getElementById("search");

      let editIndex = null;
      let currentVisitors = [];

      // Initialize the page
      function init() {
          loadVisitors();
          setupEventListeners();
      }

      // Set up event listeners
      function setupEventListeners() {
          newVisitorBtn.addEventListener("click", openNewVisitorPopup);
          closeNew.addEventListener("click", closeNewVisitorPopup);
          addVisitorBtn.addEventListener("click", handleAddVisitor);
          sortBtn.addEventListener("click", handleSort);
          searchBtn.addEventListener("click", handleSearch);
          searchInput.addEventListener("keyup", function(e) {
              if (e.key === "Enter") {
                  handleSearch();
              }
          });
      }

      // Open new visitor popup
      function openNewVisitorPopup() {
          newPopup.style.display = "flex";
          editIndex = null;
          document.getElementById("visitor-name").value = "";
          document.getElementById("phone-number").value = "";
      }

      // Close new visitor popup
      function closeNewVisitorPopup() {
          newPopup.style.display = "none";
      }

      // Load visitors from localStorage
      function loadVisitors(visitorsData = null) {
          const visitors = visitorsData || JSON.parse(localStorage.getItem("visitors")) || [];
          currentVisitors = [...visitors];
          renderVisitors(visitors);
      }

      // Render visitors to the table
      function renderVisitors(visitors) {
          visitorList.innerHTML = "";
          visitors.forEach((visitor, index) => {
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${visitor.name}</td>
                  <td>${visitor.phone}</td>
                  <td>
                      <button class="edit-btn" data-index="${index}">✏️</button>
                      <button class="delete-btn" data-index="${index}">🗑️</button>
                  </td>
              `;
              visitorList.appendChild(row);
          });

          // Set up event listeners for edit and delete buttons
          setupRowButtons();
      }

      // Set up event listeners for edit and delete buttons
      function setupRowButtons() {
          document.querySelectorAll(".delete-btn").forEach(button => {
              button.addEventListener("click", function() {
                  const index = this.getAttribute("data-index");
                  deleteVisitor(index);
              });
          });

          document.querySelectorAll(".edit-btn").forEach(button => {
              button.addEventListener("click", function() {
                  editVisitor(this.getAttribute("data-index"));
              });
          });
      }

      // Handle adding or updating a visitor
      function handleAddVisitor() {
          const name = document.getElementById("visitor-name").value.trim();
          const phone = document.getElementById("phone-number").value.trim();

          if (!name || !phone) {
              alert("Please fill in all fields");
              return;
          }

          let visitors = JSON.parse(localStorage.getItem("visitors")) || [];

          if (editIndex !== null) {
              // Update existing visitor
              visitors[editIndex] = { name, phone };
          } else {
              // Add new visitor
              visitors.push({ name, phone });
          }

          localStorage.setItem("visitors", JSON.stringify(visitors));
          loadVisitors();
          closeNewVisitorPopup();
      }

      // Edit visitor
      function editVisitor(index) {
          const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
          editIndex = index;
          document.getElementById("visitor-name").value = visitors[index].name;
          document.getElementById("phone-number").value = visitors[index].phone;
          newPopup.style.display = "flex";
      }

      // Delete visitor
      function deleteVisitor(index) {
          if (confirm("Are you sure you want to delete this visitor?")) {
              let visitors = JSON.parse(localStorage.getItem("visitors")) || [];
              visitors.splice(index, 1);
              localStorage.setItem("visitors", JSON.stringify(visitors));
              loadVisitors();
          }
      }

      // Handle sorting
      function handleSort() {
          const sortBy = sortSelect.value;
          const visitors = [...currentVisitors];

          visitors.sort((a, b) => {
              if (sortBy === "name") {
                  return a.name.localeCompare(b.name);
              } else {
                  // Default sort by ID (index)
                  return visitors.indexOf(a) - visitors.indexOf(b);
              }
          });

          renderVisitors(visitors);
      }

      // Handle search
      function handleSearch() {
          const searchTerm = searchInput.value.trim().toLowerCase();

          if (!searchTerm) {
              loadVisitors();
              return;
          }

          const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
          const filteredVisitors = visitors.filter(visitor =>
              visitor.name.toLowerCase().includes(searchTerm) ||
              visitor.phone.toLowerCase().includes(searchTerm)
          );

          loadVisitors(filteredVisitors);
      }

      // Initialize the visitors page
      init();
  }

  // ===================== CARDS PAGE ================================
  function initCards() {
      const newCardBtn = document.getElementById("new-visitor");
      const newPopup = document.getElementById("newPopup");
      const closeNew = document.getElementById("close-new");
      const addCardBtn = document.getElementById("add-visitor");
      const cardVisitorName = document.getElementById("card-visitor-name");
      const cardBookName = document.getElementById("card-book-name");
      const cardList = document.getElementById("visitor-list");

      // Load available books into the dropdown
      function loadAvailableBooks() {
          const books = JSON.parse(localStorage.getItem("books")) || [];
          cardBookName.innerHTML = '<option value="" disabled selected>Choose book name</option>';
          books.forEach(book => {
              if (book.numOfCopy > 0) {
                  const option = document.createElement("option");
                  option.value = book.bookName;
                  option.textContent = book.bookName;
                  cardBookName.appendChild(option);
              }
          });
      }

      // Load available visitors into the dropdown
      function loadAvailableVisitors() {
          const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
          cardVisitorName.innerHTML = '<option value="" disabled selected>Choose visitor</option>';
          visitors.forEach(visitor => {
              const option = document.createElement("option");
              option.value = visitor.name;
              option.textContent = visitor.name;
              cardVisitorName.appendChild(option);
          });
      }

      // Show popup
      newCardBtn.addEventListener("click", function () {
          newPopup.style.display = "flex";
          loadAvailableBooks();
          loadAvailableVisitors();
      });

      // Close popup
      closeNew.addEventListener("click", function () {
          newPopup.style.display = "none";
      });

      // Add new card (borrow a book)
      addCardBtn.addEventListener("click", function () {
          const visitorName = cardVisitorName.value;
          const bookName = cardBookName.value;
          const borrowDate = new Date().toLocaleDateString();

          if (!visitorName || !bookName) {
              alert("Please select a visitor and book.");
              return;
          }

          let books = JSON.parse(localStorage.getItem("books")) || [];
          let cards = JSON.parse(localStorage.getItem("cards")) || [];

          // Reduce book copy count
          books = books.map(book => {
              if (book.bookName === bookName && book.numOfCopy > 0) {
                  book.numOfCopy -= 1;
              }
              return book;
          });

          // Add new card
          cards.push({
              id: cards.length + 1,
              visitorName,
              bookName,
              borrowDate,
              returnDate: ""
          });

          localStorage.setItem("books", JSON.stringify(books));
          localStorage.setItem("cards", JSON.stringify(cards));

          newPopup.style.display = "none";
          loadCards();
      });

      // Load cards into table
      function loadCards() {
          const cards = JSON.parse(localStorage.getItem("cards")) || [];
          cardList.innerHTML = "";
          cards.forEach(card => {
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${card.id}</td>
                  <td>${card.visitorName}</td>
                  <td>${card.bookName}</td>
                  <td>${card.borrowDate}</td>
                  <td>${card.returnDate ? card.returnDate : '<button class="return-btn" data-id="' + card.id + '">Return</button>'}</td>
              `;
              cardList.appendChild(row);
          });

          document.querySelectorAll(".return-btn").forEach(button => {
              button.addEventListener("click", function () {
                  returnBook(this.getAttribute("data-id"));
              });
          });
      }

      // Return a book
      function returnBook(cardId) {
          let books = JSON.parse(localStorage.getItem("books")) || [];
          let cards = JSON.parse(localStorage.getItem("cards")) || [];

          const cardIndex = cards.findIndex(card => card.id == cardId);
          if (cardIndex !== -1) {
              const bookName = cards[cardIndex].bookName;
              cards[cardIndex].returnDate = new Date().toLocaleDateString();

              // Increase book copy count
              books = books.map(book => {
                  if (book.bookName === bookName) {
                      book.numOfCopy += 1;
                  }
                  return book;
              });
          }

          localStorage.setItem("books", JSON.stringify(books));
          localStorage.setItem("cards", JSON.stringify(cards));
          loadCards();
      }

      // Initialize cards page
      loadCards();
  }
});
  // ==================== STATISTICS PAGE =======================
  function initStatistics() {
    const visitorList = document.getElementById("visitor-list");
    const sortBtn = document.getElementById("sort-btn");
    const sortSelect = document.getElementById("sort");
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search");

    // Load and display statistics
    function loadStatistics() {
        displayPopularBooks();
    }

    // Display the most popular books in table format
    function displayPopularBooks() {
        const cards = JSON.parse(localStorage.getItem("cards")) || [];
        const books = JSON.parse(localStorage.getItem("books")) || [];

        // Count borrows per book
        const bookBorrowCount = {};
        cards.forEach(card => {
            if (!bookBorrowCount[card.bookName]) {
                bookBorrowCount[card.bookName] = 0;
            }
            bookBorrowCount[card.bookName]++;
        });

        // Sort by borrow count (descending)
        const sortedBooks = Object.entries(bookBorrowCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5

        visitorList.innerHTML = "";
        sortedBooks.forEach(([bookName, count]) => {
            const bookInfo = books.find(b => b.bookName === bookName) || {};
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${bookName}</td>
                <td>${bookInfo.authorName || "Unknown"}</td>
                <td>${count}</td>
            `;
            visitorList.appendChild(row);
        });
    }

    // Display the most active visitors in table format
    function displayActiveVisitors() {
        const cards = JSON.parse(localStorage.getItem("cards")) || [];
        const visitors = JSON.parse(localStorage.getItem("visitors")) || [];

        // Count borrows per visitor
        const visitorBorrowCount = {};
        cards.forEach(card => {
            if (!visitorBorrowCount[card.visitorName]) {
                visitorBorrowCount[card.visitorName] = 0;
            }
            visitorBorrowCount[card.visitorName]++;
        });

        // Sort by borrow count (descending)
        const sortedVisitors = Object.entries(visitorBorrowCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5

        visitorList.innerHTML = "";
        sortedVisitors.forEach(([visitorName, count]) => {
            const visitorInfo = visitors.find(v => v.name === visitorName) || {};
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${visitorName}</td>
                <td>${visitorInfo.phone || "Unknown"}</td>
                <td>${count}</td>
            `;
            visitorList.appendChild(row);
        });
    }

    // Handle sorting between books and visitors
    sortBtn.addEventListener("click", function() {
        if (sortSelect.value === "id") {
            displayPopularBooks();
        } else if (sortSelect.value === "name") {
            displayActiveVisitors();
        }
    });

    // Handle search functionality
    searchBtn.addEventListener("click", function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            if (sortSelect.value === "id") {
                displayPopularBooks();
            } else {
                displayActiveVisitors();
            }
            return;
        }

        if (sortSelect.value === "id") {
            // Search in popular books
            const cards = JSON.parse(localStorage.getItem("cards")) || [];
            const books = JSON.parse(localStorage.getItem("books")) || [];

            const bookBorrowCount = {};
            cards.forEach(card => {
                if (card.bookName.toLowerCase().includes(searchTerm)) {
                    if (!bookBorrowCount[card.bookName]) {
                        bookBorrowCount[card.bookName] = 0;
                    }
                    bookBorrowCount[card.bookName]++;
                }
            });

            visitorList.innerHTML = "";
            Object.entries(bookBorrowCount)
                .sort((a, b) => b[1] - a[1])
                .forEach(([bookName, count]) => {
                    const bookInfo = books.find(b => b.bookName === bookName) || {};
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${bookName}</td>
                        <td>${bookInfo.authorName || "Unknown"}</td>
                        <td>${count}</td>
                    `;
                    visitorList.appendChild(row);
                });
        } else {
            // Search in active visitors
            const cards = JSON.parse(localStorage.getItem("cards")) || [];
            const visitors = JSON.parse(localStorage.getItem("visitors")) || [];

            const visitorBorrowCount = {};
            cards.forEach(card => {
                if (card.visitorName.toLowerCase().includes(searchTerm)) {
                    if (!visitorBorrowCount[card.visitorName]) {
                        visitorBorrowCount[card.visitorName] = 0;
                    }
                    visitorBorrowCount[card.visitorName]++;
                }
            });

            visitorList.innerHTML = "";
            Object.entries(visitorBorrowCount)
                .sort((a, b) => b[1] - a[1])
                .forEach(([visitorName, count]) => {
                    const visitorInfo = visitors.find(v => v.name === visitorName) || {};
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${visitorName}</td>
                        <td>${visitorInfo.phone || "Unknown"}</td>
                        <td>${count}</td>
                    `;
                    visitorList.appendChild(row);
                });
        }
    });

    // Initialize the statistics page
    loadStatistics();
}
