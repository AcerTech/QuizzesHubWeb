export interface Book {
    _id: String,
    title: String,
    description: String,
    isActive: Boolean,
    imgUrl: String,
    tags: String,
    user: User
}

export interface Grade {
    _id: String,
    name: String,
    description: String,
    tags: String,
    isActive: Boolean,
    displayOrder: String
}

export interface Question {
    _id: String,
    questionText: String,
    timer: Number,
    imgUrl: String,
    displayOrder: String,
    columnsCount: Number,
    isActive: Boolean,
    quiz: Quiz,
    questionType: QuestionType,
    chapter: Chapter,
    book: Book,
    answers: Answer[]
}


export interface Answer {
    _id: String,
    answerText: String,
    isCorrect: Boolean,
    imgUrl: String,
    displayOrder: String
}


export interface Image {
    _id: string,
    tags: String,
    imgUrl: String
}

export interface QuestionType {
    _id: String,
    name: String,
    isActive: Boolean,
    description: String,
    displayOrder: String
}

export interface Quiz {
    _id: string,
    name: String,
    description: String,
    isActive: Boolean,
    displayOrder: String,
    chapter: Chapter,
}

export interface Subject {
    _id: String,
    name: String,
    description: String,
    isActive: Boolean,
    displayOrder: String,
    grade: Grade
}

export interface Chapter {
    _id: String,
    name: String,
    description: String,
    isActive: Boolean,
    displayOrder: String,
    book: Book
}

export interface User {
    _id: String,
    name: String,
    email: String,
    password: String,
    role: string,
    imgUrl: String
}