## C1 API Development
day:: 2

### M API is reachable through required URL
mark:: 0.5
wsss:: 1

A JSON response, with JSON body & content type `application/json`, is provided at http://<hostname>/module-b/phase1/api/v1/concerts

### J Code is designed using modern techniques
mark:: 0.5
wsss:: 1

0. Framework not used
1. Framework is used but mostly not according to best practice and much manual coding is done
2. Framework is used but not always according to best practice
3. All available/suitable features of the framework have been used according to best practice, abstraction layer for database

## C2 Test Suite - Concert Listing
day:: 2

### M testConcertListingAll
mark:: 0.5
wsss:: 6

### M testConcertListingAllSortingCorrect
mark:: 0.25
wsss:: 6

### M testConcertListingAllStrictEquals
mark:: 0.5
wsss:: 6

## C3 Test Suite - Concert Detail
day:: 2

### M testConcertDetail
mark:: 0.5
wsss:: 6

### M testConcertDetailSortingCorrect
mark:: 0.25
wsss:: 6

### M testConcertDetailStrictEquals
mark:: 0.25
wsss:: 6

### M testConcertDetailDoesNotExist
mark:: 0.25
wsss:: 6

## C4 Test Suite - Seating
day:: 2

### M testSeating
mark:: 1
wsss:: 6

### M testSeatingSortingCorrect
mark:: 0.25
wsss:: 6

### M testSeatingStrictEquals
mark:: 0.25
wsss:: 6

### M testSeatingConcertDoesNotExist
mark:: 0.1
wsss:: 6

### M testSeatingShowDoesNotExist
mark:: 0.1
wsss:: 6

### M testSeatingShowDoesNotBelongToConcert
mark:: 0.3
wsss:: 6

## C5 Test Suite - Reservation
day:: 2

### M testReservationCreation
mark:: 0.75
wsss:: 6

### M testReservationUpdatesUnavailableSeats
mark:: 0.5
wsss:: 6

### M testReservationExpiration
mark:: 0.5
wsss:: 6

### M testReservationOfUnavailableSeats
mark:: 0.2
wsss:: 6

### M testReservationReplacement
mark:: 0.2
wsss:: 6

### M testReservationInvalidToken
mark:: 0.1
wsss:: 6

### M testReservationDeletion
mark:: 0.2
wsss:: 6

### M testReservationTokenOnOtherShow
mark:: 0.1
wsss:: 6

### M testReservationValidationDurations
mark:: 0.1
wsss:: 6

### M testReservationValidationReservations
mark:: 0.2
wsss:: 6

### M testReservationValidationRowFromDifferentShow
mark:: 0.1
wsss:: 6

### M testReservationConcertDoesNotExist
mark:: 0.1
wsss:: 6

### M testReservationShowDoesNotExist
mark:: 0.1
wsss:: 6

### M testReservationShowDoesNotBelongToConcert
mark:: 0.1
wsss:: 6

## C6 Test Suite - Booking
day:: 2

### M testBookingOneSeat
mark:: 0.5
wsss:: 6

### M testBookingMultipleSeats
mark:: 0.25
wsss:: 6

### M testBookingMultipleSeatsCorrectSorting
mark:: 0.1
wsss:: 6

### M testBookingAddressData
mark:: 0.1
wsss:: 6

### M testBookingDifferentShows
mark:: 0.2
wsss:: 6

### M testBookingSeatGetsUnavailable
mark:: 0.25
wsss:: 6

### M testBookingInvalidToken
mark:: 0.1
wsss:: 6

### M testBookingValidationRequiredFields
mark:: 0.1
wsss:: 6

### M testBookingValidationStringFields
mark:: 0.1
wsss:: 6

### M testBookingConcertDoesNotExist
mark:: 0.1
wsss:: 6

### M testBookingShowDoesNotExist
mark:: 0.1
wsss:: 6

### M testBookingShowDoesNotBelongToConcert
mark:: 0.1
wsss:: 6

## C7 Test Suite - Tickets
day:: 2

### M testTicketsValidCode
mark:: 0.5
wsss:: 6

### M testTicketsValidCodeDifferentTicket
mark:: 0.25
wsss:: 6

### M testTicketsCorrectSorting
mark:: 0.25
wsss:: 6

### M testTicketsStrictEquals
mark:: 0.25
wsss:: 6

### M testTicketsInvalidCode
mark:: 0.25
wsss:: 6

### M testTicketsGetCreatedAfterBooking
mark:: 0.25
wsss:: 6

## C8 Test Suite - Tickets Cancel
day:: 2

### M testTicketCancel
mark:: 0.5
wsss:: 6

### M testTicketCancelUpdatesBooking
mark:: 0.25
wsss:: 6

### M testTicketCancelAllowsReservation
mark:: 0.25
wsss:: 6

### M testTicketCancelInvalidCode
mark:: 0.25
wsss:: 6

### M testTicketCancelInvalidId
mark:: 0.25
wsss:: 6

----
WSSS
1	Work organization and management
2	Communication and interpersonal skills
3	WebsiteDesign
4	Layout
5	Front-End Development
6	Back-End Development
7	Content Management Systems


| WSOS SECTION | Description                            | Points |
|--------------|----------------------------------------|--------|
| 1            | Work organisation and self-management  | 1      |
| 2            | Communication and interpersonal skills | 0.5    |
| 3            | Website design                         | 0      |
| 4            | Layout                                 | 0      |
| 5            | Front-End Development                  | 0      |
| 6            | Back-End Development                   | 14     |
| 7            | Content Management Systems             | 0      |
|              |                                        |        |
| **Total**    |                                        | 15.5   |


