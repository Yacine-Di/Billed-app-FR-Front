/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js"

import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy()
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    //test de l'icon eye
    test("handleClickIconEye is called when the eye icon is clicked", () => {
      const billsInstance = new Bills({ document, onNavigate: jest.fn(), store })
      const mockIcon = document.createElement("div")
      mockIcon.setAttribute("data-bill-url", "mockBillUrl")

      billsInstance.handleClickIconEye = jest.fn()
      mockIcon.addEventListener("click", () => billsInstance.handleClickIconEye(mockIcon))
      mockIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }))

      expect(billsInstance.handleClickIconEye).toHaveBeenCalledWith(mockIcon)
    })

    test("Should open modal when click on eye icon", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = BillsUI({ data: bills })
      const billsInstance = new Bills({ document, onNavigate, store, localStorage })
      //mock handle function
      const handleClickIconEye = jest.fn(billsInstance.handleClickIconEye)
      const icons = screen.getAllByTestId("icon-eye")
      //mock modal function
      window.$.fn.modal = jest.fn()
      icons.forEach(icon => {
        icon.addEventListener("click", handleClickIconEye(icon))
      })

      //check if calls work for one icon
      userEvent.click(icons[0])
      expect(handleClickIconEye).toHaveBeenCalled()
      const modale = screen.getByTestId("modaleFile")
      expect(modale).toBeTruthy()
    })

    //Call API
    test("Should get bills from store with getbills methode", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = BillsUI({ data: bills })

      const billsInstance = new Bills({ document, onNavigate, store, localStorage })
      const billsFromMethode = await billsInstance.getBills()

      expect(billsFromMethode.length).toEqual(4)
    })

    test("Should get bills error from getbills methode", async () => {
      const mockError = new Error("Fake error")
      const wrongDataStore = {
        bills: jest.fn(() => ({
          list: jest.fn(() => Promise.reject(mockError))
        }))
      }
      const billsInstance = new Bills({ document, onNavigate, wrongDataStore })

      try {
        await billsInstance.getBills()
      } catch (err) {
        expect(err).toMatch("Fake error")
      }
    })

    // test d'intégration GET
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)

      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByText("Mes notes de frais"))
      const newBillButton = await screen.getByText("Nouvelle note de frais")
      expect(newBillButton).toBeTruthy()
      const actionsTitle = await screen.getByText("Actions")
      expect(actionsTitle).toBeTruthy()
    })

    //test Route NewBill page
    test("Should go to NewBill Page when i click on New Bill button", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)

      router()
      window.onNavigate(ROUTES_PATH.Bills)

      const btnNewBill = screen.getByTestId("btn-new-bill")
      btnNewBill.dispatchEvent(new MouseEvent("click"))
      const newBillUrl = window.location.href.replace(/^https?:\/\/localhost\//, "")
      expect(newBillUrl).toBe("#employee/bill/new")
    })
  })
})

    // test d'intégration API errors
describe("Given I am connected as an employee", () => {
  describe("When I navigate to Bills page", () => {
    describe("When an error occurs on API", () => {
      test("fetches bills from an API and fails with 404 message error", async () => {
        const mockError = new Error("Error 404")
        const wrongDataStore = {
          bills: jest.fn(() => ({
            list: jest.fn(() => Promise.reject(mockError))
          }))
        }
        const billsInstance = new Bills({ document, onNavigate, store: wrongDataStore })

        try {
          await billsInstance.getBills()
        } catch (error) {
          expect(error).toBe(mockError)
        }
      })
      test("fetches messages from an API and fails with 500 message error", async () => {
        const mockError = new Error("Error 500")
        const wrongDataStore = {
          bills: jest.fn(() => ({
            list: jest.fn(() => Promise.reject(mockError))
          }))
        }
        const billsInstance = new Bills({ document, onNavigate, store: wrongDataStore })

        try {
          await billsInstance.getBills()
        } catch (error) {
          expect(error).toBe(mockError)
        }
      })
    })
  })
})
