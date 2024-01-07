import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/css/home.css";
import AddMuscle from "../components/addmuscle";
import Muscle from "../components/muscle";
import axios from "axios";
import { backendUrl } from "../components/urlConnector";
import Nav from "../components/nav";
import { VscAdd } from "react-icons/vsc";
import { FcSearch } from "react-icons/fc";
import Loader from "../components/loader";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function startWithStr(string, substring) {
  if (substring.length > string.length) return false;

  for (let i = 0; i < substring.length; i++) {
    if (string[i].toLowerCase() != substring[i].toLowerCase()) return false;
  }
  return true;
}

function Home() {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [muscles, setMuscles] = useState([]);
  const [nextMuscleId, setNextMuscleId] = useState(0);
  const [filteredMuscles, setFilteredMuscles] = useState([]);
  const [searching, setSearching] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [freeTrial, setFreeTrial] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setFilteredMuscles(muscles);
  }, [muscles]);

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      navigate("/login");
    } else {
      setLoading(true);
      axios
        .get(backendUrl + "getAccountDetails", {
          params: {
            accountId: localStorage.getItem("id"),
          },
        })
        .then((result) => {
          const creationDate = new Date(result.data.date);
          const currentDate = new Date();
          localStorage.setItem(
            "timePassed",
            Math.floor((currentDate - creationDate) / 86400000)
          );
          localStorage.setItem("userEmail", result.data.email);

          if (!result.data.premium) {
            console.log("This is a regular account");
            //Checking expiration HERE:

            const creationDate = new Date(result.data.date);

            if (result.data.inTrial) {
              localStorage.setItem("inTrial", "true");
              console.log("You are in Trial, Did it expired ?");
              const currentDate = new Date();
              setFreeTrial(true);
              if (isNaN(creationDate.getTime())) {
                console.log("Invalid Date");
                setExpired(true);
              } else {
                if (currentDate - creationDate >= 5184000000) {
                  // The number is 8 weaks in miliseconds
                  setExpired(true);
                  console.log("Your free Trial (7 days) has been expired");
                } else {
                  setExpired(false);
                  console.log("Account has not been expired yet.");
                }
              }
              console.log(
                `Time passed sense the Creation Date `,
                (currentDate - creationDate) / 86400000 /*convert to days*/,
                "days"
              );
            } else {
              localStorage.setItem("inTrial", "false");
              // not in trial HERE
              console.log("You are not in Trial");
              const currentDate = new Date();
              if (isNaN(creationDate.getTime())) {
                console.log("Invalid Date");
                setExpired(true);
              } else {
                const currentDate = new Date();
                if (currentDate - creationDate >= 2592000000) {
                  // The number is a month in miliseconds
                  setExpired(true);
                  console.log("Account has been expired.");
                } else {
                  setExpired(false);
                  console.log("Account has not been expired yet.");
                }
                console.log(
                  `Time passed sense the Creation Date `,
                  (currentDate - creationDate) / 86400000 /*convert to days*/,
                  "days"
                );
              }
            }
          } else {
            console.log("This is a premium Account");
          }
          localStorage.setItem("accountName", result.data.name);
          setMuscles(result.data.muscles);
          setNextMuscleId(
            result.data.muscles.length > 0
              ? result.data.muscles[result.data.muscles.length - 1].muscleId + 1
              : 0
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const activeAccount = () => {
    axios
      .post(backendUrl + "activeAccount", null, {
        params: {
          accountId: localStorage.getItem("id"),
        },
      })
      .then((result) => {
        console.log(result);
      });
  };
  const changeFreeTrialToFalse = () => {
    axios
      .post(backendUrl + "changeFreeTrial", null, {
        params: {
          accountId: localStorage.getItem("id"),
        },
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const addMuscleLocaly = (muscleName) => {
    setMuscles((current) => [
      ...current,
      {
        muscleId: nextMuscleId,
        muscleName: muscleName,
        muscleExercises: [],
      },
    ]);
  };
  const removeMuscle = (muscleId) => {
    axios
      .post(backendUrl + "removeMuscle", null, {
        params: {
          accountId: localStorage.getItem("id"),
          muscleId: muscleId,
        },
      })
      .then((result) => {
        console.log(result.data + "{on db side}");
      });
    setMuscles((currnet) =>
      currnet.filter((muscle) => muscle.muscleId !== muscleId)
    );
  };
  const renameMuscleLocaly = (muscleId, newName) => {
    const newMuscles = muscles.map((item) => {
      if (item.muscleId === muscleId) {
        return { ...item, muscleName: newName };
      }
      return item;
    });

    setMuscles(newMuscles);
  };
  return (
    <>
      {!expired ? ( 
        <div className="home-container">
          <Nav />
          {!adding && !inspecting && (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <h1>Muscles Page ({filteredMuscles.length})</h1>
                <div className="buttons-home">
                  <FcSearch
                    id="clickable"
                    size={35}
                    style={{
                      border: "2px solid black",
                      padding: 5,
                      borderRadius: 28,
                      marginRight: 3,
                    }}
                    onClick={() => {
                      if (searching) {
                        setFilteredMuscles(muscles);
                      }
                      setSearching((current) => !current);
                    }}
                  />
                  <VscAdd
                    id="clickable"
                    onClick={() => {
                      setAdding((current) => !current);
                    }}
                    size={35}
                    color="#3f6ce1"
                    style={{
                      border: "2px solid #3f6ce1",
                      padding: 5,
                      borderRadius: 28,
                    }}
                  />
                </div>
              </div>
              {searching && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: 10,
                  }}
                >
                  <input
                    placeholder="Search for a muscle"
                    className="form-control"
                    style={{ width: "95%" }}
                    onChange={(e) => {
                      setFilteredMuscles(
                        muscles.filter((m) =>
                          startWithStr(m.muscleName, e.target.value)
                        )
                      );
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <br />
          {!adding ? (
            <div id="scroller">
              {filteredMuscles.length > 0 ? (
                <div>
                  {filteredMuscles.map((muscle, index) => (
                    <Muscle //here
                      renameMuscleLocaly={renameMuscleLocaly}
                      setInspecting={setInspecting} //
                      key={muscle.muscleId}
                      removeMe={removeMuscle}
                      muscleId={muscle.muscleId}
                      name={muscle.muscleName}
                      muscleExercises={muscle.muscleExercises}
                      index={index}
                    ></Muscle>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 10 }}>
                  <h2>There are 0 muscles</h2>
                </div>
              )}
              <br />
            </div>
          ) : (
            <AddMuscle
              setAdding={setAdding}
              nextMuscleId={nextMuscleId}
              setNextMuscleId={setNextMuscleId}
              addMuscleLocaly={addMuscleLocaly}
            />
          )}
          {loading && <Loader />}
        </div>
      ) : (
        <div
          style={{
            padding: 20,
            direction: `${language === "en" ? "ltr" : "rtl"}`,
          }}
        >
          <button
            className="btn btn-danger m-2"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Log out
          </button>
          <button
            className="btn btn-primary m-2"
            onClick={() => {
              setLanguage((currnet) => (currnet === "en" ? "he" : "en"));
            }}
          >
            {language === "en" ? "Change language" : "שנה שפה"}
          </button>
          <br />
          <br />
          <br />
          <h3>User Name: {localStorage.getItem('userName')}</h3>
          {language === "en" ? (
            <h1>
              Your subscription period has ended. To continue using our service,
              please renew your subscription now. You will not be able to access
              our service until your subscription is renewed.
            </h1>
          ) : (
            <h1>
              תקופת המנוי שלך הסתיימה. כדי להמשיך להשתמש בשירות שלנו, אנא חדש את
              המנוי שלך עכשיו. לא תוכל לגשת לשירות שלנו עד לחידוש המנוי שלך.
            </h1>
          )}
          {language === "en" ? (
            <div>
              <h6>
                Your payment information will not be automatically charged every
                month, in every month you will need to pay again.
              </h6>
              <p>
                By making a payment today, you will receive an additional month
                of uninterrupted access to our services
              </p>
            </div>
          ) : (
            <div>
              <h1>
                פרטי התשלום שלך לא יחויבו אוטומטית בכל חודש, בכל חודש תצטרך לשלם
                שוב.
              </h1>
              <p>
                על ידי ביצוע תשלום היום, תקבל חודש נוסף של גישה רציפה לשירותים
                שלנו
              </p>
            </div>
          )}
          <br />

          <PayPalScriptProvider
            options={{
              "client-id": process.env.REACT_APP_LIVEMODE_PAYMENT, // 3 when doing subscription, none when doing one time punchase
              currency: "ILS",
              // vault: true, //same us one below
              // intent:'subscription', // unable while doing one time punchase
            }}
          >
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: "10.00",
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(function () {
                  console.log("approved");
                  if (freeTrial) {
                    changeFreeTrialToFalse(); // will change the date to the current + will change inTrial field to false
                  } else {
                    activeAccount(); // will change the date to the current
                  }
                  setExpired(false);
                });
              }}
            />
          </PayPalScriptProvider>
          {language === "en" ? (
            <div>
              <p>
                Please note that we do not have access to your payment
                information, as it is handled securely by PayPal, which acts as
                a mediator between us and you. When you make a payment on our
                website, you will be redirected to PayPal's secure payment
                gateway, where you can enter your payment details with
                confidence. This means that we do not store or have access to
                your credit card information, making your transactions with us
                safe and secure.
              </p>
              <br />
              <p>
                If you have any questions or encounter any issues with your
                payment, please do not hesitate to contact us at
                <a href="mailto:liftit.contact@gmail.com">
                  liftit.contact@gmail.com
                </a>
                . Our customer support team is here to help you with any
                concerns you may have.
              </p>
            </div>
          ) : (
            <div style={{ paddingBottom: 30 }}>
              <p>
                שים לב שאין לנו גישה לפרטי התשלום שלך, מכיוון שהוא מטופל בצורה
                מאובטחת על ידי PayPal, הפועלת כמתווך בינינו וביניכם. כאשר תבצע
                תשלום באתר האינטרנט שלנו, תעשה זאת להיות מופנה לשער התשלום
                המאובטח של PayPal, שבו אתה יכול הזן את פרטי התשלום שלך בביטחון.
                זה אומר שאנחנו כן לא לאחסן או לקבל גישה לפרטי כרטיס האשראי שלך,
                מה שהופך העסקאות שלך איתנו בטוחות ומאובטחות.
              </p>
              <p>
                אם יש לך שאלות או נתקלת בבעיות כלשהן עם התשלום, אנא אל תהסס
                לפנות אלינו בכתובת
                <a href="mailto:liftit.contact@gmail.com">
                  liftit.contact@gmail.com
                </a>
                . צוות תמיכת הלקוחות שלנו כאן כדי לעזור לך בכל החששות שיש לך.
              </p>
            </div>
          )}
          <br />
          <br />
        </div>
      )}
    </>
  );
}

export default Home;
