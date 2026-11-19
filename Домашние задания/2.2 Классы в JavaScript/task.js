// ================================
// ЗАДАЧА 1. ПЕЧАТНЫЕ ИЗДАНИЯ
// ================================

class PrintEditionItem {
    constructor(name, releaseDate, pagesCount) {
        this.name = name;
        this.releaseDate = releaseDate;
        this.pagesCount = pagesCount;
        this._state = 100;
        this.type = null;
    }

    // Геттер состояния
    get state() {
        return this._state;
    }

    // Сеттер состояния с ограничением от 0 до 100
    set state(value) {
        if (typeof value !== "number" || Number.isNaN(value)) {
            return;
        }

        this._state = Math.min(100, Math.max(0, value));
    }

    // Восстановление издания
    fix() {
        // Новое и полностью уничтоженное издание восстановить нельзя
        if (this.state > 0 && this.state < 100) {
            this.state *= 1.5;
        }
    }
}


// Журналы
class Magazine extends PrintEditionItem {
    constructor(name, releaseDate, pagesCount) {
        super(name, releaseDate, pagesCount);
        this.type = "magazine";
    }
}


// Книги
class Book extends PrintEditionItem {
    constructor(author, name, releaseDate, pagesCount) {
        super(name, releaseDate, pagesCount);

        this.author = author;
        this.type = "book";
    }
}


// Романы
class NovelBook extends Book {
    constructor(author, name, releaseDate, pagesCount) {
        super(author, name, releaseDate, pagesCount);
        this.type = "novel";
    }
}


// Фантастические произведения
class FantasticBook extends Book {
    constructor(author, name, releaseDate, pagesCount) {
        super(author, name, releaseDate, pagesCount);
        this.type = "fantastic";
    }
}


// Детективы
class DetectiveBook extends Book {
    constructor(author, name, releaseDate, pagesCount) {
        super(author, name, releaseDate, pagesCount);
        this.type = "detective";
    }
}


// ================================
// ПРОВЕРКА ЗАДАЧИ 1
// ================================

const sherlock = new PrintEditionItem(
    "Полное собрание повестей и рассказов о Шерлоке Холмсе",
    2019,
    1008
);

console.log(sherlock.releaseDate); // 2019
console.log(sherlock.state);       // 100

sherlock.fix();
console.log(sherlock.state);       // 100 — новое издание не меняется

sherlock.state = 50;
sherlock.fix();
console.log(sherlock.state);       // 75

sherlock.state = -10;
console.log(sherlock.state);       // 0

sherlock.fix();
console.log(sherlock.state);       // 0 — уничтоженное издание не восстановить

sherlock.state = 150;
console.log(sherlock.state);       // 100

const picknick = new FantasticBook(
    "Аркадий и Борис Стругацкие",
    "Пикник на обочине",
    1972,
    168
);

console.log(picknick.author);      // Аркадий и Борис Стругацкие
console.log(picknick.name);        // Пикник на обочине
console.log(picknick.type);        // fantastic

picknick.state = 10;
picknick.fix();

console.log(picknick.state);       // 15


// ================================
// ЗАДАЧА 2. БИБЛИОТЕКА
// ================================

class Library {
    constructor(name) {
        this.name = name;
        this.books = [];
    }

    // Добавление книги или журнала
    addBook(book) {
        if (book && book.state > 30) {
            this.books.push(book);
        }
    }

    // Поиск издания по любому свойству
    findBookBy(type, value) {
        const foundBook = this.books.find(book => book[type] === value);

        return foundBook || null;
    }

    // Выдача книги читателю
    giveBookByName(bookName) {
        const book = this.findBookBy("name", bookName);

        if (book === null) {
            return null;
        }

        const index = this.books.indexOf(book);

        this.books.splice(index, 1);

        return book;
    }
}


// ================================
// ПРОВЕРКА ЗАДАЧИ 2
// ================================

const library = new Library("Библиотека имени Ленина");

// Добавляем несколько изданий разных типов
library.addBook(
    new DetectiveBook(
        "Артур Конан Дойл",
        "Шерлок Холмс",
        2019,
        1008
    )
);

library.addBook(
    new FantasticBook(
        "Аркадий и Борис Стругацкие",
        "Пикник на обочине",
        1972,
        168
    )
);

library.addBook(
    new NovelBook(
        "Герберт Уэллс",
        "Машина времени",
        1895,
        138
    )
);

library.addBook(
    new Magazine(
        "Мурзилка",
        1924,
        60
    )
);

// Ищем издание 1919 года
let book1919 = library.findBookBy("releaseDate", 1919);

// Если такого издания нет, создаём его
if (book1919 === null) {
    book1919 = new NovelBook(
        "Александр Грин",
        "Алые паруса",
        1919,
        200
    );

    library.addBook(book1919);
}

console.log(library.findBookBy("name", "Властелин колец"));
// null — такой книги нет

console.log(library.findBookBy("releaseDate", 1924).name);
// Мурзилка

console.log(library.findBookBy("releaseDate", 1919).name);
// Алые паруса

// Выдаём книгу читателю
console.log("Количество книг до выдачи:", library.books.length);

const issuedBook = library.giveBookByName("Машина времени");

console.log("Выданная книга:", issuedBook.name);
console.log("Количество книг после выдачи:", library.books.length);

// Повреждаем выданную книгу
issuedBook.state = 40;

console.log("Состояние повреждённой книги:", issuedBook.state);
// 40

// Восстанавливаем книгу
issuedBook.fix();

console.log("Состояние восстановленной книги:", issuedBook.state);
// 60

// Пытаемся вернуть книгу в библиотеку
library.addBook(issuedBook);

console.log("Количество книг после возврата:", library.books.length);
// Книга добавлена обратно, поскольку её состояние больше 30