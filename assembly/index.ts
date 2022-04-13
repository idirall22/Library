import { storage, context, logging, env, u128 } from "near-sdk-as"
import { ContractPromiseBatch } from "near-sdk-core"
import { Book, books, booksIdBorrow, BorrowBook } from "./model"
// The entry file of your WebAssembly module.

const BookPerPage = 10
const AmountToBorrow: u128 = u128.from("1000000000000000000000000")

export function create(title: string): void {
  const book = new Book(title)
  books.push(book)
}

export function getBook(id: i32): Book {
  assert(books.length > id, "invalid book id")
  return books[id]
}

export function deleteBook(id: i32): void {
  assert(books.containsIndex(id), "invalid book id")
  books.swap_remove(id)
}

export function listBooks(page: i32): Array<Book> {
  const outBooks: Array<Book> = []

  for (let i = page * BookPerPage; i < books.length; i++) {
    outBooks.push(books[i])
  }
  return outBooks
}

export function borrowBook(id: i32): void {
  assert(books.containsIndex(id), "invalid book id")
  assert(AmountToBorrow == context.attachedDeposit, "invalid attached deposit")
  assert(!booksIdBorrow.contains(id), "the book was borrowed")
  booksIdBorrow.set(id, new BorrowBook(id, context.attachedDeposit))
}

export function returnBook(id: i32): void {
  assert(books.containsIndex(id), "invalid book id")
  assert(booksIdBorrow.contains(id), "the book was not borrowed yet")
  const borrow: BorrowBook = booksIdBorrow.getSome(id)
  ContractPromiseBatch.create(borrow.sender).transfer(borrow.deposit)
  booksIdBorrow.delete(id)
}
