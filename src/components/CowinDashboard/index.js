// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

const initialApiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class CowinDashboard extends Component {
  state = {
    coverageData: {},
    ageData: {},
    genderData: {},
    apiStatus: initialApiStatus.initial,
  }

  componentDidMount() {
    this.getDetails()
  }

  getFormattedData = each => ({
    vaccineDate: each.vaccine_date,
    dose1: each.dose_1,
    dose2: each.dose_2,
  })

  getFormattedData2 = each => ({
    age: each.age,
    count: each.count,
  })

  getFormattedData3 = each => ({
    count: each.count,
    gender: each.gender,
  })

  getDetails = async () => {
    this.setState({apiStatus: initialApiStatus.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const last7daysData = data.last_7_days_vaccination.map(each =>
        this.getFormattedData(each),
      )
      console.log(last7daysData)
      const vaccineByAgeData = data.vaccination_by_age.map(each =>
        this.getFormattedData2(each),
      )
      const vaccineByGender = data.vaccination_by_gender.map(each =>
        this.getFormattedData3(each),
      )
      console.log(vaccineByGender)
      console.log(vaccineByAgeData)
      this.setState({
        coverageData: last7daysData,
        ageData: vaccineByAgeData,
        genderData: vaccineByGender,
        apiStatus: initialApiStatus.success,
      })
    } else {
      this.setState({apiStatus: initialApiStatus.failure})
    }
  }

  getVaccinationCoverage = () => {
    const {coverageData} = this.state
    console.log(coverageData)
    return (
      <div className="coverageCard">
        <VaccinationCoverage coverageDetails={coverageData} />
      </div>
    )
  }

  getVaccinationByGender = () => {
    const {genderData} = this.state
    console.log(genderData)
    return (
      <div className="coverageCard">
        <VaccinationByGender genderDetails={genderData} />
      </div>
    )
  }

  getVaccinationAge = () => {
    const {ageData} = this.state
    console.log(ageData)
    return (
      <div className="coverageCard">
        <VaccinationByAge ageDetails={ageData} />
      </div>
    )
  }

  getFailureView = () => (
    <div className="failureCard">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="errorImage"
      />
      <h1 className="error">Something Went Wrong</h1>
    </div>
  )

  getSuccessView = () => (
    <div className="successCard">
      {this.getVaccinationCoverage()}
      {this.getVaccinationByGender()}
      {this.getVaccinationAge()}
    </div>
  )

  getLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" width={50} height={50} color="#ffffff" />
    </div>
  )

  getApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initialApiStatus.success:
        return this.getSuccessView()
      case initialApiStatus.failure:
        return this.getFailureView()
      case initialApiStatus.inProgress:
        return this.getLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bgContainer">
        <div className="logoCard">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="title">Co-WIN</h1>
        </div>
        <h1 className="heading1">CoWIN Vaccination in India</h1>
        <div className="detailsCard">{this.getApiStatus()}</div>
      </div>
    )
  }
}

export default CowinDashboard
