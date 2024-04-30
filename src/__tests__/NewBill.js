/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"
import userEvent from "@testing-library/user-event"

beforeEach(() => {
  const html = NewBillUI()
  document.body.innerHTML = html
})

afterEach(() =>  {
  document.body.innerHTML = ""
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and form is filled correctly", () => {
    test("Then new bill should be submited", () => {
      //to-do write assertion
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

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn((e) => e.preventDefault())
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
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
