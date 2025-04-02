document.addEventListener("DOMContentLoaded", function() {
  // Get the current page from the URL
  const currentPage = window.location.pathname.split('/').pop().split('.')[0];

  // Run only the code for the current page
  if (currentPage === 'statistics') {
      initStatistics();
  } else if (currentPage === 'book') {
      initBooks();
  } else if (currentPage === 'visitors') {
      initVisitors();
  } else if (currentPage === 'cards') {
      initCards();
  }

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

// ===================== BOOKS PAGE ================================
function initBooks() {
  const newBookBtn = document.getElementById("new-visitor");
  const newPopup = document.getElementById("newPopup");
  const closeNew = document.getElementById("close-new");
  const addBookBtn = document.getElementById("add-book");
  const bookList = document.getElementById("visitor-list");
  const sortBtn = document.getElementById("sort-btn");
  const sortSelect = document.getElementById("sort");
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search");

  let editIndex = null;
  let currentBooks = [];

  // Initialize the page
  function init() {
      loadBooks();
      setupEventListeners();
  }

  // Set up event listeners
  function setupEventListeners() {
      newBookBtn.addEventListener("click", openNewBookPopup);
      closeNew.addEventListener("click", closeNewBookPopup);
      addBookBtn.addEventListener("click", handleAddBook);
      sortBtn.addEventListener("click", handleSort);
      searchBtn.addEventListener("click", handleSearch);
      searchInput.addEventListener("keyup", function(e) {
          if (e.key === "Enter") {
              handleSearch();
          }
      });
  }

  // Open new book popup
  function openNewBookPopup() {
      newPopup.style.display = "flex";
      editIndex = null;
      document.getElementById("book-name").value = "";
      document.getElementById("author-namer").value = "";
      document.getElementById("pubilsher-name").value = "";
      document.getElementById("num-copy").value = "";
  }

  // Close new book popup
  function closeNewBookPopup() {
      newPopup.style.display = "none";
  }

  // Load books from localStorage
  function loadBooks(booksData = null) {
      const books = booksData || JSON.parse(localStorage.getItem("books")) || [];
      currentBooks = [...books];
      renderBooks(books);
  }

  // Render books to the table
  function renderBooks(books) {
      bookList.innerHTML = "";
      books.forEach((book, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${index + 1}</td>
              <td>${book.bookName}</td>
              <td>${book.authorName}</td>
              <td>${book.publisher}</td>
              <td>${book.numOfCopy}</td>
              <td>
                  <button class="edit-btn" data-index="${index}">✏️</button>
                  <button class="delete-btn" data-index="${index}">🗑️</button>
              </td>
          `;
          bookList.appendChild(row);
      });

      // Set up event listeners for edit and delete buttons
      setupRowButtons();
  }

  // Set up event listeners for edit and delete buttons
  function setupRowButtons() {
      document.querySelectorAll(".delete-btn").forEach(button => {
          button.addEventListener("click", function() {
              const index = this.getAttribute("data-index");
              deleteBook(index);
          });
      });

      document.querySelectorAll(".edit-btn").forEach(button => {
          button.addEventListener("click", function() {
              editBook(this.getAttribute("data-index"));
          });
      });
  }

  // Handle adding or updating a book
  function handleAddBook() {
      const bookName = document.getElementById("book-name").value.trim();
      const authorName = document.getElementById("author-namer").value.trim();
      const publisher = document.getElementById("pubilsher-name").value.trim();
      let numOfCopy = document.getElementById("num-copy").value.trim();

      // Validate the number of copies
      numOfCopy = parseInt(numOfCopy);
      if (isNaN(numOfCopy) || numOfCopy < 0) {
          alert("The number of copies cannot be less than 0.");
          return;
      }

      if (!bookName || !authorName || !publisher || numOfCopy === "") {
          alert("Please fill in all fields");
          return;
      }

      let books = JSON.parse(localStorage.getItem("books")) || [];

      if (editIndex !== null) {
          // Update existing book
          books[editIndex] = { bookName, authorName, publisher, numOfCopy };
      } else {
          // Add new book
          books.push({ bookName, authorName, publisher, numOfCopy });
      }

      localStorage.setItem("books", JSON.stringify(books));
      loadBooks();
      closeNewBookPopup();
  }

  // Edit book
  function editBook(index) {
      const books = JSON.parse(localStorage.getItem("books")) || [];
      editIndex = index;
      document.getElementById("book-name").value = books[index].bookName;
      document.getElementById("author-namer").value = books[index].authorName;
      document.getElementById("pubilsher-name").value = books[index].publisher;
      document.getElementById("num-copy").value = books[index].numOfCopy;
      newPopup.style.display = "flex";
  }

  // Delete book
  function deleteBook(index) {
      if (confirm("Are you sure you want to delete this book?")) {
          let books = JSON.parse(localStorage.getItem("books")) || [];
          books.splice(index, 1);
          localStorage.setItem("books", JSON.stringify(books));
          loadBooks();
      }
  }

  // Handle sorting
  function handleSort() {
      const sortBy = sortSelect.value;
      const books = [...currentBooks];

      books.sort((a, b) => {
          if (sortBy === "bookName") {
              return a.bookName.localeCompare(b.bookName);
          } else if (sortBy === "authorName") {
              return a.authorName.localeCompare(b.authorName);
          } else if (sortBy === "numOfCopy") {
              return a.numOfCopy - b.numOfCopy;
          } else {
              // Default sort by ID (index)
              return books.indexOf(a) - books.indexOf(b);
          }
      });

      renderBooks(books);
  }

  // Handle search
  function handleSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();

      if (!searchTerm) {
          loadBooks();
          return;
      }

      const books = JSON.parse(localStorage.getItem("books")) || [];
      const filteredBooks = books.filter(book =>
          book.bookName.toLowerCase().includes(searchTerm) ||
          book.authorName.toLowerCase().includes(searchTerm) ||
          book.publisher.toLowerCase().includes(searchTerm)
      );

      loadBooks(filteredBooks);
  }

  // Initialize the books page
  init();
}
// Initialize the books page when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Check if we're on the books page
  if (window.location.pathname.includes("books.html") ||
      document.querySelector('a[href="books.html"].active')) {
      initBooks();
  }
});

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