import { VMContext, u128, Context, context } from "near-sdk-as"
import { Book, books, booksIdBorrow } from "../model"
import { create, borrowBook, deleteBook, getBook, listBooks, returnBook } from ".."

describe("Library", () => {
  beforeEach(() => {
    VMContext.setSigner_account_id("bob")
    VMContext.setAttached_deposit(u128.fromString('0'));
    VMContext.setAccount_balance(u128.fromString('0'));
  });

  afterEach(() => {
    for (let i = 0; i < books.length; i++) {
      books.pop()
    }
  })

  it("create book", () => {
    const title: string = "Near contracts"
    create(title)
    expect(books[0].title).toStrictEqual(title)
  });

  it("get book", () => {
    const title: string = "Near contracts"
    create(title)
    const book: Book = getBook(0)
    expect(book.title).toStrictEqual(title)
  });

  it("delete book", () => {
    const title: string = "Near contracts"
    create(title)
    deleteBook(0)
    expect(books.length).toBe(0)
  });

  it("list book", () => {
    create("Near contracts")
    create("Near contracts 2")
    const outBooks: Array<Book> = listBooks(0)
    expect(outBooks.length).toBe(2)
  });

  it("borrow book", () => {
    create("Near contracts")
    VMContext.setAccount_balance(u128.from('10000000000000000000000000'));
    VMContext.setAttached_deposit(u128.from('1000000000000000000000000'));
    VMContext.setSigner_account_id('bob');

    borrowBook(0)
    const outBooks: Array<Book> = listBooks(0)
    expect(outBooks.length).toBe(1)
    expect(booksIdBorrow.contains(0)).toBeTruthy
    expect(booksIdBorrow.getSome(0).deposit).toBe(u128.from('1000000000000000000000000'))
    expect(booksIdBorrow.getSome(0).sender).toBe(context.sender)
  });
  
  itThrows("Fail borrow book", () => {
    create("Near contracts")
    borrowBook(0)
  }, "invalid attached deposit")


  it("borrow book", () => {
    create("Near contracts")
    VMContext.setAccount_balance(u128.from('10000000000000000000000000'));
    VMContext.setAttached_deposit(u128.from('1000000000000000000000000'));
    VMContext.setSigner_account_id('bob');
    borrowBook(0)
    const accountBalanceBeforeReturn = context.accountBalance
    returnBook(0)
    expect(context.accountBalance > accountBalanceBeforeReturn).toBeTruthy
  });
});
