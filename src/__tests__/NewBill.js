/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import userEvent from "@testing-library/user-event"

beforeEach(() => {
  const html = NewBillUI()
  document.body.innerHTML = html
})

afterEach(() =>  {
  document.body.innerHTML = ""
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then new bill should submited", () => {
      //to-do write assertion

      const form = screen.getByTestId("form-new-bill")
      
      const inputDepenseName = screen.getByTestId("expense-name")
      fireEvent.change(inputDepenseName, {target: {value: "Vol et train"}})
      expect(inputDepenseName.value).toBe("Vol et train")

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
