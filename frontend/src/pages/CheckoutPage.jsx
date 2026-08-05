import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { useCart } from '../context/CartContext'
import { useAlert } from '../context/AlertContext'

import {
  PROVINCES,
  getDistrictLabel,
  calculateShipping,
} from '../services/shippingService'


const LKR = (value) => {
  return (
    'LKR ' +
    Number(value || 0).toLocaleString('en-LK')
  )
}


// ======================================================
// LOGIN CHECK
// ======================================================

function isLoggedIn() {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  return Boolean(token && user)
}


// ======================================================
// CHECKOUT PAGE
// ======================================================

export default function CheckoutPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const {
    cartItems = [],
    removeFromCart,
  } = useCart()

  const { showAlert } = useAlert()


  // ====================================================
  // BUY NOW DATA
  // ====================================================

  const buyNowItem =
    location.state?.buyNowItem || null

  const mode =
    location.state?.mode ||
    (buyNowItem ? 'buyNow' : 'cart')


  // ====================================================
  // STATE
  // ====================================================

  const [checkoutItems, setCheckoutItems] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [fullName, setFullName] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [address, setAddress] =
    useState('')

  const [city, setCity] =
    useState('')

  const [postalCode, setPostalCode] =
    useState('')

  const [province, setProvince] =
    useState('')

  const [district, setDistrict] =
    useState('')

  const [paymentMethod, setPaymentMethod] =
    useState('CASH_ON_DELIVERY')

  const [placingOrder, setPlacingOrder] =
    useState(false)


  // ====================================================
  // CHECK LOGIN + LOAD ITEMS
  // ====================================================

  useEffect(() => {

    if (!isLoggedIn()) {

      navigate('/login', {
        replace: true,
        state: {
          from: '/checkout',
          checkoutMode: mode,
          buyNowItem: buyNowItem,
        },
      })

      return
    }


    // BUY NOW
    if (
      mode === 'buyNow' &&
      buyNowItem
    ) {

      setCheckoutItems([
        buyNowItem,
      ])

    }

    // CART
    else {

      setCheckoutItems(
        Array.isArray(cartItems)
          ? cartItems
          : []
      )

    }

    setLoading(false)

  }, [
    mode,
    buyNowItem,
    cartItems,
    navigate,
  ])


  // ====================================================
  // SELECTED PROVINCE
  // ====================================================

  const selectedProvince = useMemo(() => {

    if (
      !Array.isArray(PROVINCES)
    ) {
      return null
    }

    return PROVINCES.find(
      (item) =>
        item.name === province
    ) || null

  }, [province])


  // ====================================================
  // DISTRICTS
  // ====================================================

  const availableDistricts =
    selectedProvince?.districts || []


  // ====================================================
  // SUBTOTAL
  // ====================================================

  const subtotal =
    checkoutItems.reduce(
      (sum, item) => {

        const price =
          Number(item?.price || 0)

        const quantity =
          Number(item?.quantity || 1)

        return (
          sum +
          price * quantity
        )

      },
      0
    )


  // ====================================================
  // SHIPPING
  // ====================================================

  const shipping = useMemo(() => {

    try {

      return Number(
        calculateShipping(
          province,
          district
        ) || 0
      )

    } catch (error) {

      console.error(
        'Shipping calculation error:',
        error
      )

      return 0
    }

  }, [
    province,
    district,
  ])


  // ====================================================
  // TOTAL
  // ====================================================

  const total =
    subtotal + shipping


  // ====================================================
  // REMOVE ITEM
  // ====================================================

  const handleRemoveItem =
    async (item) => {

      setCheckoutItems(
        (previous) =>
          previous.filter(
            (checkoutItem) =>
              String(
                checkoutItem?.gemId
              ) !==
              String(
                item?.gemId
              )
          )
      )


      if (
        mode === 'cart' &&
        item?.gemId
      ) {

        try {

          await removeFromCart(
            item.gemId
          )

        } catch (error) {

          console.error(
            'Remove cart item error:',
            error
          )
        }
      }
    }


  // ====================================================
  // PROVINCE CHANGE
  // ====================================================

  const handleProvinceChange =
    (value) => {

      setProvince(value)

      setDistrict('')
    }


  // ====================================================
  // PLACE ORDER
  // ====================================================

  const handlePlaceOrder =
    async (event) => {

      event.preventDefault()


      // -----------------------------------------------
      // LOGIN CHECK
      // -----------------------------------------------

      if (!isLoggedIn()) {

        navigate('/login', {
          replace: true,
          state: {
            from: '/checkout',
            checkoutMode: mode,
            buyNowItem: buyNowItem,
          },
        })

        return
      }


      // -----------------------------------------------
      // ITEMS CHECK
      // -----------------------------------------------

      if (
        checkoutItems.length === 0
      ) {

showAlert({
        type: 'warning',
        title: 'No items selected',
        message: 'There are no items to checkout.',
      })

        return
      }


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!fullName.trim()) {

showAlert({
        type: 'warning',
        title: 'Missing information',
        message: 'Please enter your full name.',
      })

        return
      }


      if (!phone.trim()) {

showAlert({
        type: 'warning',
        title: 'Missing information',
        message: 'Please enter your phone number.',
      })

        return
      }


      if (!address.trim()) {

showAlert({
        type: 'warning',
        title: 'Missing information',
        message: 'Please enter your delivery address.',
      })

        return
      }


      if (!city.trim()) {

showAlert({
        type: 'warning',
        title: 'Missing information',
        message: 'Please enter your city.',
      })

        return
      }


      if (!postalCode.trim()) {

showAlert({
        type: 'warning',
        title: 'Missing information',
        message: 'Please enter your postal code.',
      })

        return
      }


      if (!province) {

showAlert({
        type: 'warning',
        title: 'Missing information',
        message: 'Please select your province.',
      })

        return
      }


      if (!district) {

showAlert({
        type: 'warning',
        title: 'Missing information',
        message: 'Please select your district.',
      })

        return
      }


      // -----------------------------------------------
      // ORDER DATA
      // -----------------------------------------------

      try {

        setPlacingOrder(true)


        const orderData = {

          mode,

          items: checkoutItems,

          shippingAddress: {

            fullName:
              fullName.trim(),

            phone:
              phone.trim(),

            address:
              address.trim(),

            city:
              city.trim(),

            postalCode:
              postalCode.trim(),

            province,

            district,
          },

          subtotal,

          shipping,

          total,

          paymentMethod,
        }


        console.log(
          'ORDER DATA:',
          orderData
        )


        /*
         * ------------------------------------------------
         * IMPORTANT
         * ------------------------------------------------
         *
         * Your backend order API can be connected here.
         *
         * For now this only confirms that all information
         * is valid.
         *
         * ------------------------------------------------
         */


        showAlert({
          type: 'success',
          title: 'Order ready',
          message: 'Checkout information is valid. Order API will be connected next.',
        })


      } catch (error) {

        console.error(
          'Checkout error:',
          error
        )

        showAlert({
          type: 'error',
          title: 'Checkout failed',
          message: 'Something went wrong while processing your order.',
        })

      } finally {

        setPlacingOrder(false)
      }
    }


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight: '100vh',
          background: '#050508',
          color: '#fff',
        }}
      >

        <Navbar visible={true} />

        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color:
              'rgba(255,255,255,0.6)',
          }}
        >

          Loading checkout...

        </div>

      </div>
    )
  }


  // ====================================================
  // MAIN PAGE
  // ====================================================

  return (

    <div
      style={{
        minHeight: '100vh',
        background: '#050508',
        color: '#fff',
      }}
    >

      <Navbar visible={true} />


      <main
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding:
            '9rem 6vw 7rem',
          boxSizing: 'border-box',
        }}
      >


        {/* ============================================
            HEADER
        ============================================ */}

        <div
          style={{
            marginBottom: '2.5rem',
          }}
        >

          <div
            style={{
              color: '#C9A84C',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            ◆ Secure Checkout
          </div>


          <h1
            style={{
              fontFamily:
                "'Cormorant Garamond', serif",
              fontSize:
                'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 300,
              margin:
                '0.6rem 0',
            }}
          >
            Checkout
          </h1>


          <p
            style={{
              color:
                'rgba(255,255,255,0.4)',
              fontSize: '0.75rem',
              margin: 0,
            }}
          >

            {mode === 'buyNow'
              ? 'You are purchasing this gem directly.'
              : 'Review your selected gems before placing your order.'}

          </p>

        </div>


        {/* ============================================
            EMPTY CHECKOUT
        ============================================ */}

        {checkoutItems.length === 0 ? (

          <div
            style={{
              textAlign: 'center',
              padding: '5rem 1rem',
              border:
                '1px solid rgba(255,255,255,0.07)',
            }}
          >

            <h2
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '2rem',
                color:
                  'rgba(255,255,255,0.5)',
              }}
            >
              No items to checkout
            </h2>


            <button
              type="button"
              onClick={() =>
                navigate('/shop')
              }
              style={{
                marginTop: '1rem',
                padding:
                  '0.7rem 1.4rem',
                background:
                  'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                border: 'none',
                cursor: 'pointer',
                color: '#0A0A0D',
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Return to Shop
            </button>

          </div>

        ) : (


          /* ==========================================
             CHECKOUT FORM
          ========================================== */

          <form
            onSubmit={
              handlePlaceOrder
            }
          >

            <div
              className="checkout-grid"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(0, 1fr) 350px',
                gap: '2rem',
                alignItems: 'start',
              }}
            >


              {/* ======================================
                  LEFT SIDE
              ====================================== */}

              <div>


                {/* ==================================
                    ITEMS
                ================================== */}

                <section
                  style={{
                    padding: '1.5rem',
                    border:
                      '1px solid rgba(255,255,255,0.07)',
                    background:
                      'rgba(255,255,255,0.015)',
                    marginBottom: '1.5rem',
                  }}
                >

                  <SectionTitle>
                    {mode === 'buyNow'
                      ? 'Gem to Purchase'
                      : 'Cart Items'}
                  </SectionTitle>


                  {checkoutItems.map(
                    (item) => (

                      <div
                        key={
                          item.gemId
                        }
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            '90px minmax(0,1fr) auto',
                          gap: '1rem',
                          alignItems:
                            'center',
                          padding:
                            '0.9rem 0',
                          borderBottom:
                            '1px solid rgba(255,255,255,0.05)',
                        }}
                      >


                        {/* IMAGE */}

                        <div
                          style={{
                            width: 90,
                            height: 90,
                            background:
                              'rgba(255,255,255,0.03)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >

                          {item.imageUrl ? (

                            <img
                              src={
                                item.imageUrl
                              }
                              alt={
                                item.name ||
                                'Gemstone'
                              }
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit:
                                  'cover',
                              }}
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  'none'
                              }}
                            />

                          ) : (

                            <div
                              style={{
                                width: 48,
                                height: 48,
                                background:
                                  `linear-gradient(135deg, ${
                                    item.color ||
                                    '#C9A84C'
                                  }CC, ${
                                    item.color ||
                                    '#C9A84C'
                                  }44)`,
                                clipPath:
                                  'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)',
                              }}
                            />

                          )}

                        </div>


                        {/* DETAILS */}

                        <div>

                          <div
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', serif",
                              fontSize: '1.2rem',
                              marginBottom:
                                '0.3rem',
                            }}
                          >
                            {
                              item.name ||
                              'Gemstone'
                            }
                          </div>


                          <div
                            style={{
                              fontSize: '0.62rem',
                              color:
                                'rgba(255,255,255,0.35)',
                            }}
                          >

                            {item.caratWeight ||
                              '-'}{' '}
                            ct ·{' '}

                            {item.cut ||
                              '-'}{' '}
                            Cut ·{' '}

                            {item.clarity ||
                              '-'}

                          </div>


                          <div
                            style={{
                              fontFamily:
                                "'Cormorant Garamond', serif",
                              fontSize: '1rem',
                              marginTop:
                                '0.45rem',
                            }}
                          >
                            {LKR(
                              item.price
                            )}
                          </div>

                        </div>


                        {/* REMOVE */}

                        {mode === 'cart' && (

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveItem(
                                item
                              )
                            }
                            style={{
                              padding:
                                '0.4rem 0.6rem',
                              background:
                                'transparent',
                              border:
                                '1px solid rgba(239,68,68,0.25)',
                              color: '#EF4444',
                              cursor: 'pointer',
                              fontSize:
                                '0.55rem',
                              letterSpacing:
                                '0.08em',
                              textTransform:
                                'uppercase',
                            }}
                          >
                            Remove
                          </button>

                        )}

                      </div>

                    )
                  )}

                </section>


                {/* ==================================
                    DELIVERY
                ================================== */}

                <section
                  style={{
                    padding: '1.5rem',
                    border:
                      '1px solid rgba(255,255,255,0.07)',
                    background:
                      'rgba(255,255,255,0.015)',
                  }}
                >

                  <SectionTitle>
                    Delivery Information
                  </SectionTitle>


                  <div
                    className="delivery-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(2, minmax(0,1fr))',
                      gap: '1rem',
                    }}
                  >

                    <Input
                      label="Full Name"
                      value={
                        fullName
                      }
                      onChange={
                        setFullName
                      }
                      placeholder="Enter full name"
                    />


                    <Input
                      label="Phone Number"
                      value={
                        phone
                      }
                      onChange={
                        setPhone
                      }
                      placeholder="07XXXXXXXX"
                    />


                    <div
                      style={{
                        gridColumn:
                          '1 / -1',
                      }}
                    >

                      <Input
                        label="Delivery Address"
                        value={
                          address
                        }
                        onChange={
                          setAddress
                        }
                        placeholder="House number, street name"
                      />

                    </div>


                    <Input
                      label="City"
                      value={
                        city
                      }
                      onChange={
                        setCity
                      }
                      placeholder="Enter city"
                    />


                    <Input
                      label="Postal Code"
                      value={
                        postalCode
                      }
                      onChange={
                        setPostalCode
                      }
                      placeholder="Enter postal code"
                    />


                    <SelectInput
                      label="Province"
                      value={
                        province
                      }
                      onChange={
                        handleProvinceChange
                      }
                      options={
                        Array.isArray(
                          PROVINCES
                        )
                          ? PROVINCES.map(
                              (item) => ({
                                value:
                                  item.name,
                                label:
                                  item.name,
                              })
                            )
                          : []
                      }
                      placeholder="Select province"
                    />


                    <SelectInput
                      label="District"
                      value={
                        district
                      }
                      onChange={
                        setDistrict
                      }
                      disabled={
                        !province
                      }
                      options={
                        availableDistricts.map(
                          (item) => ({
                            value:
                              item,
                            label:
                              getDistrictLabel(
                                item
                              ),
                          })
                        )
                      }
                      placeholder={
                        province
                          ? 'Select district'
                          : 'Select province first'
                      }
                    />

                  </div>

                </section>


                {/* ==================================
                    PAYMENT
                ================================== */}

                <section
                  style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    border:
                      '1px solid rgba(255,255,255,0.07)',
                    background:
                      'rgba(255,255,255,0.015)',
                  }}
                >

                  <SectionTitle>
                    Payment Method
                  </SectionTitle>


                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      border:
                        '1px solid rgba(201,168,76,0.3)',
                      cursor: 'pointer',
                    }}
                  >

                    <input
                      type="radio"
                      checked={
                        paymentMethod ===
                        'CASH_ON_DELIVERY'
                      }
                      onChange={() =>
                        setPaymentMethod(
                          'CASH_ON_DELIVERY'
                        )
                      }
                    />


                    <div>

                      <div
                        style={{
                          fontSize: '0.72rem',
                        }}
                      >
                        Cash on Delivery
                      </div>


                      <div
                        style={{
                          fontSize: '0.6rem',
                          color:
                            'rgba(255,255,255,0.3)',
                          marginTop:
                            '0.25rem',
                        }}
                      >
                        Pay when your order is delivered
                      </div>

                    </div>

                  </label>

                </section>

              </div>


              {/* ======================================
                  RIGHT SIDE
              ====================================== */}

              <aside
                style={{
                  position: 'sticky',
                  top: '100px',
                  padding: '1.5rem',
                  border:
                    '1px solid rgba(201,168,76,0.2)',
                  background:
                    'rgba(201,168,76,0.035)',
                }}
              >

                <SectionTitle>
                  Order Summary
                </SectionTitle>


                {/* ITEMS */}

                <div
                  style={{
                    maxHeight: 260,
                    overflowY: 'auto',
                    marginBottom: '1rem',
                  }}
                >

                  {checkoutItems.map(
                    (item) => (

                      <div
                        key={
                          item.gemId
                        }
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          gap: '1rem',
                          marginBottom:
                            '0.8rem',
                          fontSize:
                            '0.68rem',
                        }}
                      >

                        <span
                          style={{
                            color:
                              'rgba(255,255,255,0.55)',
                          }}
                        >
                          {
                            item.name ||
                            'Gemstone'
                          }
                        </span>


                        <span>
                          {LKR(
                            Number(
                              item.price ||
                                0
                            ) *
                              Number(
                                item.quantity ||
                                  1
                              )
                          )}
                        </span>

                      </div>

                    )
                  )}

                </div>


                <SummaryRow
                  label="Subtotal"
                  value={
                    LKR(subtotal)
                  }
                />


                <SummaryRow
                  label="Shipping"
                  value={
                    province &&
                    district
                      ? LKR(
                          shipping
                        )
                      : 'Select address'
                  }
                />


                {province &&
                  district && (

                    <div
                      style={{
                        fontSize: '0.55rem',
                        color:
                          'rgba(255,255,255,0.25)',
                        marginTop:
                          '-0.4rem',
                        marginBottom:
                          '1rem',
                      }}
                    >

                      Delivery to{' '}

                      {getDistrictLabel(
                        district
                      )}

                      , {province}

                    </div>

                  )}


                {/* TOTAL */}

                <div
                  style={{
                    borderTop:
                      '1px solid rgba(255,255,255,0.1)',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                  }}
                >

                  <span>
                    Total
                  </span>


                  <span
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', serif",
                      fontSize: '1.5rem',
                    }}
                  >
                    {LKR(total)}
                  </span>

                </div>


                {/* PLACE ORDER */}

                <button
                  type="submit"
                  disabled={
                    placingOrder
                  }
                  style={{
                    width: '100%',
                    marginTop: '1.5rem',
                    padding: '0.95rem',
                    background:
                      'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                    border: 'none',
                    borderRadius: '2px',
                    color: '#0A0A0D',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.13em',
                    textTransform:
                      'uppercase',
                    cursor:
                      placingOrder
                        ? 'not-allowed'
                        : 'pointer',
                    opacity:
                      placingOrder
                        ? 0.6
                        : 1,
                  }}
                >

                  {placingOrder
                    ? 'Processing...'
                    : 'Place Order'}

                </button>


                {/* CONTINUE SHOPPING */}

                <button
                  type="button"
                  onClick={() =>
                    navigate('/shop')
                  }
                  style={{
                    width: '100%',
                    marginTop: '0.6rem',
                    padding: '0.75rem',
                    background:
                      'transparent',
                    border:
                      '1px solid rgba(255,255,255,0.1)',
                    color:
                      'rgba(255,255,255,0.4)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    textTransform:
                      'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Continue Shopping
                </button>

              </aside>

            </div>

          </form>

        )}

      </main>


      <Footer />


      {/* ==============================================
          RESPONSIVE CSS
      ============================================== */}

      <style>{`

        @media (max-width: 850px) {

          .checkout-grid {
            grid-template-columns: 1fr !important;
          }

          .checkout-grid aside {
            position: static !important;
          }

        }


        @media (max-width: 600px) {

          .delivery-grid {
            grid-template-columns: 1fr !important;
          }

          .delivery-grid > div {
            grid-column: auto !important;
          }

        }

      `}</style>

    </div>
  )
}


// ======================================================
// SECTION TITLE
// ======================================================

function SectionTitle({
  children,
}) {

  return (

    <div
      style={{
        color: '#C9A84C',
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '1.25rem',
      }}
    >
      {children}
    </div>

  )
}


// ======================================================
// INPUT
// ======================================================

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {

  return (

    <label
      style={{
        display: 'block',
      }}
    >

      <span
        style={{
          display: 'block',
          fontSize: '0.58rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color:
            'rgba(255,255,255,0.3)',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </span>


      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '0.75rem',
          background:
            'rgba(255,255,255,0.025)',
          border:
            '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          outline: 'none',
          borderRadius: '2px',
          fontSize: '0.72rem',
        }}
      />

    </label>

  )
}


// ======================================================
// SELECT
// ======================================================

function SelectInput({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
}) {

  return (

    <label
      style={{
        display: 'block',
      }}
    >

      <span
        style={{
          display: 'block',
          fontSize: '0.58rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color:
            'rgba(255,255,255,0.3)',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </span>


      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        disabled={disabled}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '0.75rem',
          background: '#0c0c10',
          border:
            '1px solid rgba(255,255,255,0.1)',
          color: value
            ? '#fff'
            : 'rgba(255,255,255,0.35)',
          outline: 'none',
          borderRadius: '2px',
          fontSize: '0.72rem',
          cursor: disabled
            ? 'not-allowed'
            : 'pointer',
        }}
      >

        <option value="">
          {placeholder}
        </option>


        {options.map(
          (option) => (

            <option
              key={
                option.value
              }
              value={
                option.value
              }
              style={{
                background:
                  '#0c0c10',
                color: '#fff',
              }}
            >
              {
                option.label
              }
            </option>

          )
        )}

      </select>

    </label>

  )
}


// ======================================================
// SUMMARY ROW
// ======================================================

function SummaryRow({
  label,
  value,
}) {

  return (

    <div
      style={{
        display: 'flex',
        justifyContent:
          'space-between',
        marginBottom: '0.8rem',
        fontSize: '0.72rem',
      }}
    >

      <span
        style={{
          color:
            'rgba(255,255,255,0.45)',
        }}
      >
        {label}
      </span>


      <span>
        {value}
      </span>

    </div>

  )
}