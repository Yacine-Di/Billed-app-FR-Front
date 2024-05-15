/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"

beforeEach(() => {
  const html = NewBillUI()
  document.body.innerHTML = html
})

afterEach(() =>  {
  document.body.innerHTML = ""
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    } 
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    //Test POST
    test("Should be submited when click on submit button", () => {
      const inputDepenseName = screen.getByTestId("expense-name")
      expect(inputDepenseName.value).toBe("")

      const inputDate = screen.getByTestId("datepicker")
      fireEvent.change(inputDate, {target: {value: "2024-04-28"}})
      expect(inputDate.value).toBe("2024-04-28")

      const inputAmount = screen.getByTestId("amount")
      fireEvent.change(inputAmount, { target: {value: 250}})
      expect(Number(inputAmount.value)).toBe(250)

      const inputTVA = screen.getByTestId("vat")
      fireEvent.change(inputTVA, { target: {value: 10}})
      expect(Number(inputTVA.value)).toBe(10)

      const inputPercentage = screen.getByTestId("pct")
      fireEvent.change(inputPercentage, { target: {value: 5}})
      expect(Number(inputPercentage.value)).toBe(5)

      const inputCommentary = screen.getByTestId("commentary")
      fireEvent.change(inputCommentary, { target: {value: "Ceci est un commentaire"}})
      expect(inputCommentary.value).toBe("Ceci est un commentaire")

      const bill = new NewBill({document, onNavigate, store: mockStore, localStorage})
      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(bill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
    })

    test("Should upload file when it is jpeg/jpg/png format", () => {
      const bill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage })
      const mockFile = new File(["mock text"],"mockFile.jpeg", { type: "image/jpeg" })

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId("file")
      fileInput.addEventListener("change", handleChangeFile)
      fireEvent.change(fileInput, {target: {files: [mockFile]} })
      expect(handleChangeFile).toHaveBeenCalled()
    })

    test("Should display error when file is not jpeg/jpg/png format", () => {
      const bill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage })
      const mockFile = new File(["mock text"],"mockFile.txt", { type: "text/plain" })

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId("file")
      fileInput.addEventListener("change", handleChangeFile)
      fireEvent.change(fileInput, {target: {files: [mockFile]} })
      const errorMsg = screen.queryAllByText("Le fichier sélectionné n'est pas au bon format")
      expect(errorMsg).toBeTruthy()
    })

    test("Should remove div error when good file format is selected after bad file format", () => {
      const bill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage })
      const mockFileTxt = new File(["mock text"],"mockFile.txt", { type: "text/plain" })
      const mockFileImg = new File(["mock text"],"mockFile.jpeg", { type: "image/jpeg" })

      const handleChangeFile = jest.fn((e) => bill.handleChangeFile(e))
      const fileInput = screen.getByTestId("file")
      fileInput.addEventListener("change", handleChangeFile)
      fireEvent.change(fileInput, {target: {files: [mockFileTxt]} })

      fireEvent.change(fileInput, {target: {files: [mockFileImg]} })
      const errorMsg = screen.queryByText("Le fichier sélectionné n'est pas au bon format")
      expect(errorMsg).toBeNull()

    })
  })
})

describe("NewBill Unit Test Suites", () =>  {
  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
  } 

  it("should be defined", () => {
    const bill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage })
    expect(bill.document).toBe(document)
    expect(bill.onNavigate).toBeDefined()
    expect(bill.store).toBe(mockStore)
  })
})
