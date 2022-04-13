import { PersistentVector, PersistentMap, u128, context } from "near-sdk-as"

@nearBindgen
export class Book {
    title: string
    constructor(title: string) {
        this.title = title
    }
}

@nearBindgen
export class BorrowBook {
    id: i32
    deposit: u128
    sender: string
    constructor(id: i32, deposit: u128) {
        this.id = id
        this.deposit = deposit
        this.sender = context.sender
    }
}

export const books = new PersistentVector<Book>("p")
export const booksIdBorrow = new PersistentMap<i32, BorrowBook>("b")