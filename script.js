document.addEventListener("DOMContentLoaded", function () {
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
      books.forEach((book) => {
        if (book.numOfCopy > 0) {
          const option = document.createElement("option");
          option.value = book.bookName;
          option.textContent = book.bookName;
          cardBookName.appendChild(option);
        }
      });
    }

    // Load visitors into the dropdown
    function loadVisitorsDropdown() {
      const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
      cardVisitorName.innerHTML = '<option value="" disabled selected>Choose visitor name</option>';
      visitors.forEach((visitor) => {
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
      loadVisitorsDropdown();
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
      books = books.map((book) => {
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
        returnDate: "",
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
      cards.forEach((card) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${card.id}</td>
                  <td>${card.visitorName}</td>
                  <td>${card.bookName}</td>
                  <td>${card.borrowDate}</td>
                  <td>${
                    card.returnDate
                      ? card.returnDate
                      : '<button class="return-btn" data-id="' +
                        card.id +
                        '">Return</button>'
                  }</td>
              `;
        cardList.appendChild(row);
      });

      document.querySelectorAll(".return-btn").forEach((button) => {
        button.addEventListener("click", function () {
          returnBook(this.getAttribute("data-id"));
        });
      });
    }

    // Return a book
    function returnBook(cardId) {
      let books = JSON.parse(localStorage.getItem("books")) || [];
      let cards = JSON.parse(localStorage.getItem("cards")) || [];

      const cardIndex = cards.findIndex((card) => card.id == cardId);
      if (cardIndex !== -1) {
        const bookName = cards[cardIndex].bookName;
        cards[cardIndex].returnDate = new Date().toLocaleDateString();

        // Increase book copy count
        books = books.map((book) => {
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

    loadCards();
  });

// ===================== Book Management ================================
document.addEventListener("DOMContentLoaded", function () {
  const newBookBtn = document.getElementById("new-visitor"); // Change name to 'new-book'
  const newPopup = document.getElementById("newPopup");
  const closeNew = document.getElementById("close-new");
  const addBookBtn = document.getElementById("add-book"); // Button to add book
  const bookList = document.getElementById("visitor-list"); // Book list table
  const sortBtn = document.getElementById("sort-btn");
  const sortSelect = document.getElementById("sort");
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search");

  let editIndex = null;

  // Show popup for adding new book or editing existing one
  newBookBtn.addEventListener("click", function () {
    newPopup.style.display = "flex";
    editIndex = null;
    document.getElementById("book-name").value = "";
    document.getElementById("author-namer").value = "";
    document.getElementById("pubilsher-name").value = "";
    document.getElementById("num-copy").value = "";
  });

  // Close popup
  closeNew.addEventListener("click", function () {
    newPopup.style.display = "none";
  });

  // Load books from localStorage
  function loadBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
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

    // Add event listeners for delete and edit buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        deleteBook(index);
      });
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", function () {
        editIndex = this.getAttribute("data-index");
        const books = JSON.parse(localStorage.getItem("books")) || [];
        document.getElementById("book-name").value = books[editIndex].bookName;
        document.getElementById("author-namer").value =
          books[editIndex].authorName;
        document.getElementById("pubilsher-name").value =
          books[editIndex].publisher;
        document.getElementById("num-copy").value = books[editIndex].numOfCopy;
        newPopup.style.display = "flex";
      });
    });
  }

  // Delete a book
  function deleteBook(index) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
  }

  // Add or edit a book
  addBookBtn.addEventListener("click", function () {
    const bookName = document.getElementById("book-name").value;
    const authorName = document.getElementById("author-namer").value;
    const publisher = document.getElementById("pubilsher-name").value;
    let numOfCopy = document.getElementById("num-copy").value;

    // Validate the number of copies (it should not be less than 0)
    numOfCopy = parseInt(numOfCopy);
    if (isNaN(numOfCopy) || numOfCopy < 0) {
      alert("The number of copies cannot be less than 0.");
      return;
    }

    if (!bookName || !authorName || !publisher || numOfCopy === "") return;

    let books = JSON.parse(localStorage.getItem("books")) || [];

    if (editIndex !== null) {
      books[editIndex] = { bookName, authorName, publisher, numOfCopy };
    } else {
      books.push({ bookName, authorName, publisher, numOfCopy });
    }

    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
    newPopup.style.display = "none";
  });

  // Sort books
  sortBtn.addEventListener("click", function () {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const sortOption = sortSelect.value;

    if (sortOption === "bookName") {
      books.sort((a, b) => a.bookName.localeCompare(b.bookName));
    } else if (sortOption === "authorName") {
      books.sort((a, b) => a.authorName.localeCompare(b.authorName));
    } else if (sortOption === "numOfCopy") {
      books.sort((a, b) => a.numOfCopy - b.numOfCopy);
    }

    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
  });

  // Search books
  searchBtn.addEventListener("click", function () {
    const query = searchInput.value.toLowerCase();
    let books = JSON.parse(localStorage.getItem("books")) || [];
    const filteredBooks = books.filter(
      (book) =>
        book.bookName.toLowerCase().includes(query) ||
        book.authorName.toLowerCase().includes(query) ||
        book.publisher.toLowerCase().includes(query)
    );

    bookList.innerHTML = "";
    filteredBooks.forEach((book, index) => {
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

    // Add event listeners for search results
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        deleteBook(index);
      });
    });

    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", function () {
        editIndex = this.getAttribute("data-index");
        const books = JSON.parse(localStorage.getItem("books")) || [];
        document.getElementById("book-name").value = books[editIndex].bookName;
        document.getElementById("author-namer").value =
          books[editIndex].authorName;
        document.getElementById("pubilsher-name").value =
          books[editIndex].publisher;
        document.getElementById("num-copy").value = books[editIndex].numOfCopy;
        newPopup.style.display = "flex";
      });
    });
  });

  loadBooks();
});
//======================= Card Managemnet ===============================
document.addEventListener("DOMContentLoaded", function () {
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
    cardBookName.innerHTML =
      '<option value="" disabled selected>Choose book name</option>';
    books.forEach((book) => {
      if (book.numOfCopy > 0) {
        const option = document.createElement("option");
        option.value = book.bookName;
        option.textContent = book.bookName;
        cardBookName.appendChild(option);
      }
    });
  }

  // Show popup
  newCardBtn.addEventListener("click", function () {
    newPopup.style.display = "flex";
    loadAvailableBooks();
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

    if (!visitorName || !bookName)
      return alert("Please select a visitor and book.");

    let books = JSON.parse(localStorage.getItem("books")) || [];
    let cards = JSON.parse(localStorage.getItem("cards")) || [];

    // Reduce book copy count
    books = books.map((book) => {
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
      returnDate: "",
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
    cards.forEach((card) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${card.id}</td>
                <td>${card.visitorName}</td>
                <td>${card.bookName}</td>
                <td>${card.borrowDate}</td>
                <td>${
                  card.returnDate
                    ? card.returnDate
                    : '<button class="return-btn" data-id="' +
                      card.id +
                      '">Return</button>'
                }</td>
            `;
      cardList.appendChild(row);
    });

    document.querySelectorAll(".return-btn").forEach((button) => {
      button.addEventListener("click", function () {
        returnBook(this.getAttribute("data-id"));
      });
    });
  }

  // Return a book
  function returnBook(cardId) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let cards = JSON.parse(localStorage.getItem("cards")) || [];

    const cardIndex = cards.findIndex((card) => card.id == cardId);
    if (cardIndex !== -1) {
      const bookName = cards[cardIndex].bookName;
      cards[cardIndex].returnDate = new Date().toLocaleDateString();

      // Increase book copy count
      books = books.map((book) => {
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

  loadCards();
});
