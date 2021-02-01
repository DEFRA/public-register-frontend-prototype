const Constants = (module.exports = {})

Constants.DATE_FORMAT_DMY = 'DD/MM/YYYY'
Constants.DATE_FORMAT_DMY_WITH_HMS = 'DD/MM/YYYY HH:mm:ss'
Constants.DATE_FORMAT_FULL = 'Do MMMM YYYY'

Constants.Views = {
  CONTACT: {
    route: 'contact',
    pageHeading: 'Request further information about this permit'
  },
  CONTACT_COMPLETE: {
    route: 'contact-complete',
    pageHeading: 'CONTACT COMPLETE'
  },
  DOWNLOAD: {
    route: 'download',
    pageHeading: 'Unable to download document'
  },
  ENTER_PERMIT_NUMBER: {
    route: 'enter-permit-number',
    pageHeading: 'Do you know the permit number of the record you are looking for?'
  },
  HOME: {
    route: 'home',
    pageHeading: 'Search for documents on the public register'
  },
  PERMIT_NOT_FOUND: {
    route: 'permit-not-found',
    pageHeading: 'Unable to find permit'
  },
  SERVICE_STATUS: {
    route: 'service-status',
    pageHeading: 'Service status'
  },
  SOMETHING_WENT_WRONG: {
    route: 'something-went-wrong',
    pageHeading: 'Oops, something went wrong'
  },
  VIEW_PERMIT_DETAILS: {
    route: 'view-permit-details',
    pageHeading: 'Permit details'
  }
}
