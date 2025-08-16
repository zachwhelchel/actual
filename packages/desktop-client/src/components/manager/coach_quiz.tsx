import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Airtable from 'airtable';

import { type State } from 'loot-core/client/state-types';
import { send } from 'loot-core/src/platform/client/fetch';
import { Sparkles } from 'lucide-react';

import { Button, ButtonWithLoading } from '../common/Button2';

import AirtableButton from './airtable-button';

import * as colorPalette from '../../style/palette';
import { View } from '../common/View';

import ReactPixel from 'react-facebook-pixel';

// const TEST_DATA = {
//   coaches: [
//     {
//       id: '1',
//       name: 'Sarah Johnson',
//       photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
//       price: 'Affordable',
//       niches: ['Career Development', 'Public Speaking', 'Leadership']
//     },
//     {
//       id: '2',
//       name: 'Michael Chen',
//       photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
//       price: 'Premium',
//       niches: ['Executive Coaching', 'Leadership', 'Business Strategy']
//     },
//     {
//       id: '3',
//       name: 'Lisa Rodriguez',
//       photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
//       price: 'Average',
//       niches: ['Work-Life Balance', 'Stress Management', 'Career Development']
//     },
//     {
//       id: '4',
//       name: 'James Wilson',
//       photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
//       price: 'Premium',
//       niches: ['Business Strategy', 'Sales Coaching', 'Leadership']
//     },
//     {
//       id: '5',
//       name: 'Emma Thompson',
//       photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
//       price: 'Affordable',
//       niches: ['Personal Development', 'Stress Management', 'Public Speaking']
//     }
//   ]
// };

const TEST_DATA = {
  coaches: [],
};

const CoachQuiz = ({ jumpToUser = false, firstName, lastName, email }) => {
  var initialStage = -1;
  var initialPremium = false;

  const storedParams = localStorage.getItem('urlParams');
  const params = storedParams ? JSON.parse(storedParams) : null;
  console.log('storedParams');
  console.log(params);

  if (params?.plan_purchased === 'premium') {
    initialStage = 0;
    initialPremium = true;
  }

  if (jumpToUser) {
    initialStage = 3;
  }

  const [currentStage, setCurrentStage] = useState(initialStage);
  const [coaches, setCoaches] = useState([]);
  const [uniqueNiches, setUniqueNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingTestData, setUsingTestData] = useState(false);
  const [showingAlternatives, setShowingAlternatives] = useState(false);

  const [allCoaches, setAllCoaches] = useState([]);
  const [allUniqueNiches, setAllUniqueNiches] = useState([]);
  const [premiumDesired, setPremiumDesired] = useState(initialPremium);
  const [premiumPurchasedAlready, setPremiumPurchasedAlready] =
    useState(initialPremium);

  // Store answers
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState(null);

  const [freeZoomLink, setFreeZoomLink] = useState(null);
  const [coachPhoto, setCoachPhoto] = useState(null);

  const [formData, setFormData] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    phoneNumber: '',
    foundUs: '',
    motivation: '',
    language: '',
    shareContact: '',
  });

  const userData = useSelector((state: State) => state.user.data);

  useEffect(() => {
    if (window.ReactNativeWebView) {
      if (userData?.userId !== null) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'need_stuff_mobile_flow',
            userId: userData?.userId,
            firstName: firstName,
            lastName: lastName,
            email: email,
          }),
        );
      }
    }
  }, []);

  // Contact form data
  // const [formData, setFormData] = useState({
  //   name: '',
  //   foundUs: '',
  //   motivation: ''
  // });

  const basicSelected = async () => {
    console.log('basicSelected');

    let formattedCoaches = allCoaches;

    const allNiches = formattedCoaches.flatMap(coach => coach.niches);
    const uniqueNichesList = [...new Set(allNiches)].sort();

    setCoaches(formattedCoaches);
    setUniqueNiches(uniqueNichesList);

    setPremiumDesired(false);
    setSelectedNiches([]);
    setCurrentStage(0);
  };

  const premiumSelected = async () => {
    console.log('premiumSelected');

    let formattedCoaches = allCoaches.filter(coach => coach.premium === true);

    const allNiches = formattedCoaches.flatMap(coach => coach.niches);
    const uniqueNichesList = [...new Set(allNiches)].sort();

    setCoaches(formattedCoaches);
    setUniqueNiches(uniqueNichesList);

    setPremiumDesired(true);
    setSelectedNiches([]);
    setCurrentStage(0);
  };

  const handleNextFromNiches = async () => {
    console.log('handleNextFromNiches');
    if (premiumDesired === true) {
      setCurrentStage(2);
    } else {
      setCurrentStage(1);
    }
  };

  // Progress bar component
  const ProgressBar = () => (
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgb(229, 231, 235)', // bg-gray-200
        height: '0.5rem', // h-2
        borderRadius: '9999px', // rounded-full
        marginBottom: '1.5rem', // mb-6
      }}
    >
      <div
        style={{
          backgroundColor: '#8719e0', // bg-blue-500
          height: '0.5rem', // h-2
          borderRadius: '9999px', // rounded-full
          transition: 'all 300ms', // transition-all duration-300
          width: `${((currentStage + 2) / 4) * 100}%`,
        }}
      />
    </div>
  );

  const selectThisCoach = async (coachName, isTopRecommendation) => {
    if (userData?.userId !== null) {
      await updateUserCoachRelationship(
        userData?.userId,
        coachName,
        isTopRecommendation ? 'quiz_top_match' : 'quiz_other_match',
      );
    }

    const url = String(window.location.href);
    if (premiumDesired) {
      successUrl.searchParams.set('plan_purchased', 'premium');

      if (premiumPurchasedAlready) {
        setCurrentStage(3);
      } else {
        console.log('go pay...');

        // Build success URL with plan_purchased parameter
        let successUrl = new URL(url);
        successUrl.searchParams.set('plan_purchased', 'premium');

        // Build cancel URL (current URL without changes)
        let cancelUrl = url;

        successUrl = successUrl.toString();
        cancelUrl = cancelUrl.toString();

        let userId = userData.userId;
        let premium = true;

        const results = await send('airtable-create-checkout-session', {
          url,
          userId,
          successUrl,
          cancelUrl,
          premium,
        });

        console.log('airtable-create-checkout-session');
        console.log(results);

        window.location.href = results;
      }
    } else {
      setCurrentStage(3);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    let isValid = true;

    // Check each field
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        newErrors[key] =
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
    });

    // Update error state
    // setErrors(newErrors);

    // Only proceed if all fields are valid
    if (isValid) {
      if (userData?.userId !== null) {
        const { coach_free_zoom_link, coach_cal_user, coach_photo } =
          await updateUserData(userData?.userId);
        if (coach_cal_user !== null) {
          window.open(
            'https://cal.mybudgetcoach.com/' +
              coach_cal_user +
              '/premium-included',
            '_blank',
          );
          window.location.reload();
        } else if (coach_free_zoom_link !== null) {
          setFreeZoomLink(coach_free_zoom_link);
          setCoachPhoto(coach_photo);
          setCurrentStage(4);
        } else {
          window.location.reload();
        }
      }
    } else {
      // Optional: Scroll to the top or first error
      window.scrollTo(0, 0);
      // Or alert the user
      alert('Please fill in all required fields');
    }
  };

  const handleDoneWithFreeCall = async () => {
    window.location.reload();
  };

  const updateUserCoachRelationship = async (
    userId,
    coachId,
    coachSelectionSource,
  ) => {
    const url = String(window.location.href);
    const results = await send('airtable-update-coach', {
      url,
      coachId,
      coachSelectionSource,
    });
    console.log('updateUserCoachRelationship');
    console.log(results);
  };

  const updateUserData = async userId => {
    const url = String(window.location.href);
    const storedParams = localStorage.getItem('urlParams');
    const params = storedParams ? JSON.parse(storedParams) : null;

    //this is brittle, could miss it. should set more reliably when we get it back or actually
    //some other whole way of knowing from stripe actually would be better.
    const urlParams = new URLSearchParams(window.location.search);

    let plan_purchased_var = 'original';
    let status_var = 'free_trial';
    if (
      premiumPurchasedAlready ||
      urlParams.get('plan_purchased') === 'premium'
    ) {
      plan_purchased_var = 'premium';
      status_var = 'paid';

      //this is where we can report to the facebook pixel that a purchase has been made.

      ReactPixel.init('476212184832855');

      ReactPixel.track('Purchase', {
        value: 64.99,
        currency: 'USD',
        content_ids: ['premium_subscription'],
        content_type: 'product',
        content_name: 'Premium Monthly Subscription',
      });
    }

    const results = await send('airtable-update-user', {
      url,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      found_us: formData.foundUs,
      motivation: formData.motivation,
      language: formData.language,
      share_contact_with_coach: formData.shareContact,
      fprom_tid: params?.fprom_tid,
      fprom_ref: params?.fprom_ref,
      utm_campaign: params?.utm_campaign,
      utm_medium: params?.utm_medium,
      utm_source: params?.utm_source,
      utm_term: params?.utm_term,
      utm_content: params?.utm_content,
      plan_purchased: plan_purchased_var,
      status: status_var,
      anonymous_purchaser: params?.anonymous_purchaser,
    });
    console.log('updateUserCoachRelationship');
    console.log(results);

    const record = results.fields;

    const coach_free_zoom_link = record.coach_free_zoom_link?.[0] || null;
    let coach_cal_user = null;

    if (record.coach_cal_user && record.plan === 'premium') {
      coach_cal_user = record.coach_cal_user;
    }

    const coach_photo = record.coach_photo?.[0]?.base64 || null;

    console.log(coach_free_zoom_link);
    console.log(coach_photo);

    localStorage.removeItem('urlParams');
    window.history.replaceState({}, document.title, window.location.pathname);

    return { coach_free_zoom_link, coach_cal_user, coach_photo };
  };

  // Coach card component
  const CoachCard = ({
    coach,
    isMainResult = false,
    hasMatch,
    wasBumped = false,
  }) => {
    // Calculate matching criteria for this coach
    const matchingNiches = selectedNiches.filter(niche =>
      coach.niches.includes(niche),
    );
    const priceMatch = coach.price === selectedPrice;
    const hasAnyMatch = priceMatch || matchingNiches.length > 0;

    return (
      <div
        style={{
          textAlign: 'center',
          ...(!isMainResult
            ? {
                borderTop: '1px solid #e5e7eb',
                paddingTop: '1.5rem',
                paddingBottom: '1.5rem',
              }
            : {}),
        }}
      >
        {coach.photo && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <img
              src={coach.photo}
              alt={coach.name}
              crossOrigin="anonymous"
              style={{
                borderRadius: '9999px',
                objectFit: 'cover',
                width: '8rem',
                height: '8rem',
              }}
            />
          </div>
        )}
        <h3
          style={{
            fontWeight: 600,
            fontSize: '1.25rem',
            marginBottom: '0.5rem',
          }}
        >
          {coach.name}
        </h3>
        <div
          style={{
            backgroundColor: 'rgb(249, 250, 251)',
            padding: '1.0rem',
            borderRadius: '0.5rem',
            border: '1px solid rgb(209, 213, 219)',
          }}
        >
          <p
            style={{
              fontSize: '0.875rem',
              color: 'rgb(55, 65, 81)',
              fontStyle: 'italic',
              marginBottom: '0.5rem',
            }}
          >
            "{coach.quizQuote}"
          </p>
          <footer
            style={{
              fontSize: '0.75rem',
              color: 'rgb(107, 114, 128)',
              paddingBottom: '0.2rem',
            }}
          >
            — {coach.firstName}
          </footer>
        </div>
        <div
          style={{
            marginTop: '1rem',
            backgroundColor: 'rgb(239, 246, 255)',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '20px',
          }}
        >
          {hasAnyMatch ? (
            <>
              <h4
                style={{
                  fontWeight: 600,
                  marginTop: 0,
                  color: 'rgb(30, 64, 175)',
                  marginBottom: '0.5rem',
                }}
              >
                {isMainResult ? 'Why we matched you' : 'How they match'}
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  marginBottom: '0px',
                }}
              >
                {priceMatch && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ color: 'black' }}>✓</span>
                    <span>Offers {coach.price.toLowerCase()} pricing</span>
                  </div>
                )}
                {matchingNiches.map(niche => (
                  <div
                    key={niche}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ color: 'black' }}>✓</span>
                    <span>Specializes in {niche}</span>
                  </div>
                ))}
                {isMainResult && wasBumped && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>This coach is highly responsive</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'rgb(30, 64, 175)' }}>
              We think {coach.name.split(' ')[0]} would be a great coach to help
              you achieve your goals.
            </p>
          )}
        </div>

        <button
          onClick={() => selectThisCoach(coach.recordId, isMainResult)}
          style={{
            padding: '0.7rem 1rem',
            width: '100%',
            fontSize: '15px',
            fontWeight: 'bold',
            backgroundColor:
              selectedNiches.length === 0 ? 'rgb(209, 213, 219)' : '#8719e0',
            color: 'white',
            borderRadius: '0.5rem',
            transition: 'background-color 150ms',
            cursor: selectedNiches.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Choose {coach.firstName}
        </button>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = new Airtable({
          apiKey:
            'patesb8ApiuPgnTkp.f0f41936aedd9e96ccf7c5ea24d447d3596b3e117f67a14abe8a7176d3dd7107', //this base access is to an intentionally public resource, so the secret can be public.
        }).base('appgjreoARDMPmznt');

        const records = await base('Coaches')
          .select({
            view: 'viwU2P9LzwQMPB2lV',
            fields: [
              'Name',
              'Price',
              'Premium',
              'Photo',
              'Niche',
              'Quiz',
              'First Name',
              'Quiz Quote',
              'Quiz Weight',
              'Record Id',
            ],
            filterByFormula: '{Quiz} = 1',
          })
          .all();

        // Format coach data
        let formattedCoaches = records.map(record => ({
          id: record.id,
          name: record.get('Name'),
          firstName: record.get('First Name'),
          quizQuote: record.get('Quiz Quote'),
          recordId: record.get('Record Id'),
          price: record.get('Price'),
          photo: record.fields.Photo ? record.fields.Photo[0]?.url : null,
          premium: record.get('Premium'),
          niches: record.get('Niche') || [],
          quizWeight: parseInt(record.get('Quiz Weight')) || 5,
        }));

        //took this out for now bc cors

        formattedCoaches = formattedCoaches.filter(
          coach => coach.quizWeight !== 1,
        );

        if (premiumDesired === true) {
          formattedCoaches = formattedCoaches.filter(
            coach => coach.premium === true,
          );
        }

        // Get unique niches from all coaches
        const allNiches = formattedCoaches.flatMap(coach => coach.niches);
        const uniqueNichesList = [...new Set(allNiches)].sort();

        setAllCoaches(formattedCoaches);
        setAllUniqueNiches(uniqueNichesList);

        setCoaches(formattedCoaches);
        setUniqueNiches(uniqueNichesList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);

        // Fall back to test data
        setUsingTestData(true);
        const allTestNiches = TEST_DATA.coaches.flatMap(coach => coach.niches);
        const uniqueTestNiches = [...new Set(allTestNiches)].sort();

        setCoaches(TEST_DATA.coaches);
        setUniqueNiches(uniqueTestNiches);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNicheSelection = niche => {
    setSelectedNiches(prev => {
      if (prev.includes(niche)) {
        return prev.filter(n => n !== niche);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, niche];
    });
  };

  const findAllMatches = () => {
    const exactMatches = coaches
      .filter(coach => {
        const priceMatch = coach.price === selectedPrice;
        const nicheMatch = coach.niches.every(niche =>
          selectedNiches.includes(niche),
        );
        return priceMatch && nicheMatch;
      })
      .map(coach => ({
        ...coach,
        nicheMatchCount: selectedNiches.filter(niche =>
          coach.niches.includes(niche),
        ).length,
      }));

    const partialMatches = coaches
      .filter(coach => {
        const priceMatch = coach.price === selectedPrice;
        const nicheMatch = coach.niches.some(niche =>
          selectedNiches.includes(niche),
        );
        return (
          nicheMatch &&
          !exactMatches.some(exactCoach => exactCoach.id === coach.id)
        );
      })
      .map(coach => ({
        ...coach,
        nicheMatchCount: selectedNiches.filter(niche =>
          coach.niches.includes(niche),
        ).length,
      }));

    return {
      exactMatches,
      partialMatches,
    };
  };

  const findMatchingCoach = () => {
    const { exactMatches, partialMatches } = findAllMatches();
    // Combine all potential coaches and evaluate them
    const allPotentialCoaches = [];

    // Add exact matches with priority score
    exactMatches.forEach(coach => {
      allPotentialCoaches.push({
        coach,
        matchScore: 11, // Base score + niche matches
        totalScore: 11 + coach.quizWeight,
        isExactMatch: true,
      });
    });

    // Add partial matches with priority score
    partialMatches.forEach(coach => {
      allPotentialCoaches.push({
        coach,
        matchScore: 9 + coach.nicheMatchCount, // Base score + niche matches
        totalScore: 9 + coach.nicheMatchCount + coach.quizWeight,
        isExactMatch: false,
      });
    });

    // If no matches at all, use all coaches
    if (allPotentialCoaches.length === 0) {
      coaches.forEach(coach => {
        const nicheMatchCount = selectedNiches.filter(niche =>
          coach.niches.includes(niche),
        ).length;
        allPotentialCoaches.push({
          coach: { ...coach, nicheMatchCount },
          matchScore: nicheMatchCount,
          totalScore: nicheMatchCount + coach.quizWeight,
          isExactMatch: false,
        });
      });
    }

    if (allPotentialCoaches.length === 0) {
      return {
        coach: null,
        hasMatch: false,
        hasAlternatives: false,
        wasBumped: false,
      };
    }

    // Sort by match score first (to see who would win without weight)
    const matchOnlySort = [...allPotentialCoaches].sort(
      (a, b) => b.matchScore - a.matchScore,
    );
    const wouldBeFirst = matchOnlySort[0];

    // Sort by total score (match quality + quiz weight)
    allPotentialCoaches.sort((a, b) => b.totalScore - a.totalScore);

    // Get the actual winner
    const actualFirst = allPotentialCoaches[0];

    // Check if the weight caused a different coach to win
    const wasBumped = wouldBeFirst.coach.id !== actualFirst.coach.id;

    // Check if we have alternatives
    const hasAlternatives = allPotentialCoaches.length > 1;

    return {
      coach: actualFirst.coach,
      hasMatch: actualFirst.isExactMatch,
      hasAlternatives,
      wasBumped,
    };
  };

  const resetQuiz = () => {
    setCurrentStage(0);
    setSelectedNiches([]);
    setSelectedPrice(null);
    setShowingAlternatives(false);
  };

  const handleClick = () => {
    const baseUrl = 'https://www.mybudgetcoach.com/coaches';

    // Get current URL parameters
    const currentParams = new URLSearchParams(window.location.search);

    // Convert to object to make it easier to work with
    const paramsObject = {};
    currentParams.forEach((value, key) => {
      paramsObject[key] = value;
    });

    // Add or override our specific parameters
    const finalParams = {
      ...paramsObject,
    };

    // Create new URLSearchParams with all parameters
    const params = new URLSearchParams(finalParams);

    const url = `${baseUrl}?${params.toString()}`;
    window.location.href = url;
  };

  if (loading) {
    return (
      // <div style={{
      //   maxWidth: '36rem',        // max-w-xl
      //   marginLeft: 'auto',       // mx-auto
      //   marginRight: 'auto',      // mx-auto
      //   padding: '1.5rem',        // p-6
      //   backgroundColor: 'white', // bg-white
      //   borderRadius: '0.5rem',   // rounded-lg
      //   boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' // shadow
      // }}>
      //   <ProgressBar />
      //   <div style={{
      //     textAlign: 'center',    // text-center
      //     paddingTop: '2rem',     // py-8
      //     paddingBottom: '2rem'   // py-8
      //   }}>
      //     Loading...
      //   </div>
      // </div>
      <div />
    );
  }

  if (window.ReactNativeWebView) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: colorPalette.navy100,
          marginTop: 0,
        }}
      ></View>
    );
  }

  // Results page
  if (currentStage === 2) {
    const {
      coach: matchedCoach,
      hasMatch,
      hasAlternatives,
      wasBumped,
    } = findMatchingCoach();
    const { exactMatches, partialMatches } = findAllMatches();

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          paddingTop: 20,
          paddingBottom: 20,
          minHeight: '100vh',
          overflow: 'auto', // Add this to enable scrolling
          backgroundColor: '#f5f5f5', // Optional: adds a background color to the page
        }}
      >
        <div
          style={{
            width: '90%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <ProgressBar />
          <div
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Your Recommended Coach
            </h2>
            <CoachCard
              coach={matchedCoach}
              isMainResult={true}
              hasMatch={hasMatch}
              wasBumped={wasBumped}
            />
          </div>

          {usingTestData && (
            <div
              style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'rgb(107, 114, 128)',
                marginBottom: '1rem',
              }}
            >
              No results found.
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <button
              onClick={resetQuiz}
              style={{
                padding: '0.25rem 0.5rem',
                color: 'black',
                ':hover': {
                  color: 'rgb(30, 64, 175)',
                },
              }}
            >
              Start Over
            </button>
            {hasAlternatives && !showingAlternatives && (
              <button
                onClick={() => setShowingAlternatives(true)}
                style={{
                  padding: '0.25rem 0.5rem',
                  color: 'black',
                  ':hover': {
                    color: 'rgb(30, 64, 175)',
                  },
                }}
              >
                See Other Matches
              </button>
            )}
          </div>

          {showingAlternatives && (
            <div
              style={{
                marginTop: '2rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                Other Potential Matches
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                {[...exactMatches, ...partialMatches]
                  .filter(coach => coach.id !== matchedCoach.id)
                  .map(coach => (
                    <CoachCard
                      key={coach.id}
                      coach={coach}
                      hasMatch={exactMatches.includes(coach)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentStage === 3) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          paddingTop: 20,
          paddingBottom: 20,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5', // Optional: adds a background color to the page
        }}
      >
        <div
          style={{
            width: '90%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          {!jumpToUser && <ProgressBar />}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              About You
            </h2>

            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                margin: '0 auto',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '1.0rem',
                      fontWeight: 500,
                      color: 'rgb(55, 65, 81)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    disabled={firstName}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid rgb(209, 213, 219)',
                      fontSize: '1.0rem',
                    }}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '1.0rem',
                      fontWeight: 500,
                      color: 'rgb(55, 65, 81)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    disabled={lastName}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid rgb(209, 213, 219)',
                      fontSize: '1.0rem',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1.0rem',
                    fontWeight: 500,
                    color: 'rgb(55, 65, 81)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled={email}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgb(209, 213, 219)',
                    fontSize: '1.0rem',
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1.0rem',
                    fontWeight: 500,
                    color: 'rgb(55, 65, 81)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder="(123) 456-7890"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgb(209, 213, 219)',
                    fontSize: '1.0rem',
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1.0rem',
                    fontWeight: 500,
                    color: 'rgb(55, 65, 81)',
                    marginBottom: '0.25rem',
                  }}
                >
                  How did you find us?
                </label>
                <p
                  style={{
                    fontSize: '1.0rem',
                    color: 'rgb(107, 114, 128)',
                    marginBottom: '0.5rem',
                  }}
                >
                  How did you learn about MyBudgetCoach and your chosen coach on
                  the platform? Please be specific as this helps us reach more
                  people who want to get their finances in order.
                </p>
                <textarea
                  value={formData.foundUs}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, foundUs: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgb(209, 213, 219)',
                    fontSize: '1.0rem',
                    minHeight: '6rem',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1.0rem',
                    fontWeight: 500,
                    color: 'rgb(55, 65, 81)',
                    marginBottom: '0.25rem',
                  }}
                >
                  What is your motivation for seeking coaching?
                </label>
                <p
                  style={{
                    fontSize: '1.0rem',
                    color: 'rgb(107, 114, 128)',
                    marginBottom: '0.5rem',
                  }}
                >
                  We'll share this with your coach so they know a bit more about
                  your hopes and desires for your finances.
                </p>
                <textarea
                  value={formData.motivation}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      motivation: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgb(209, 213, 219)',
                    fontSize: '1.0rem',
                    minHeight: '6rem',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1.0rem',
                    fontWeight: 500,
                    color: 'rgb(55, 65, 81)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Share contact information with your coach?
                </label>
                <p
                  style={{
                    fontSize: '1.0rem',
                    color: 'rgb(107, 114, 128)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Allow your coach to take a more active role in helping you
                  succeed with your budget. Your information will only be used
                  for MyBudgetCoach related communication.
                </p>
                <select
                  value={formData.shareContact}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      shareContact: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgb(209, 213, 219)',
                    fontSize: '1.0rem',
                    backgroundColor: 'white',
                  }}
                  required
                >
                  <option value="">Select a preference</option>
                  <option value="share_contact_info">
                    Yes, share my contact information with my coach.
                  </option>
                  <option value="dont_share_contact_info">
                    No, don't share my contact information with my coach.
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1.0rem',
                    fontWeight: 500,
                    color: 'rgb(55, 65, 81)',
                    marginBottom: '0.25rem',
                    marginTop: '0.5rem',
                  }}
                >
                  Preferred Language
                </label>
                <select
                  value={formData.language}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, language: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgb(209, 213, 219)',
                    fontSize: '1.0rem',
                    backgroundColor: 'white',
                  }}
                  required
                >
                  <option value="">Select a language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: !jumpToUser ? 'space-between' : 'right',
                  marginTop: '1rem',
                }}
              >
                {!jumpToUser && (
                  <button
                    type="button"
                    onClick={() => setCurrentStage(2)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid rgb(209, 213, 219)',
                      borderRadius: '0.375rem',
                      backgroundColor: 'white',
                      transition: 'background-color 150ms',
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#8719e0',
                    color: 'white',
                    borderRadius: '0.375rem',
                    transition: 'background-color 150ms',
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          paddingTop: 20,
          paddingBottom: 20,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5', // Optional: adds a background color to the page
        }}
      >
        <div
          style={{
            width: '90%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: 30,
              }}
            >
              Free Zoom
            </h2>
            <FreeSessionButton
              zoomLink={freeZoomLink}
              coachPhoto={coachPhoto}
            />

            <button
              onClick={handleDoneWithFreeCall}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid rgb(209, 213, 219)',
                borderRadius: '0.25rem',
                marginTop: 30,
                transition: 'background-color 150ms',
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStage === -1) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          paddingTop: 20,
          paddingBottom: 20,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div
          style={{
            width: '90%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <ProgressBar />

          <div
            style={{
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: '#1f2937',
              }}
            >
              Choose A Plan
            </h2>
            <p
              style={{
                color: '#6b7280',
                fontSize: '1rem',
              }}
            >
              Select the plan that works best for you
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem',
            }}
          >
            {/* Premium Plan */}
            <div
              style={{
                border: '2px solid #8b5cf6',
                borderRadius: '0.75rem',
                padding: '2rem',
                position: 'relative',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
              onClick={premiumSelected}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Popular
              </div>

              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  Premium
                </h3>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  $64.99
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 'normal',
                      color: '#6b7280',
                    }}
                  >
                    /month
                  </span>
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  1 Month Money Back Guarantee
                </div>
              </div>

              <div
                style={{
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      color: '#4b5563',
                      fontSize: '0.9rem',
                    }}
                  >
                    1 month money back guarantee
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#8b5cf6',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      color: '#4b5563',
                      fontSize: '0.9rem',
                    }}
                  >
                    1 hour session included monthly
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      color: '#4b5563',
                      fontSize: '0.9rem',
                    }}
                  >
                    Extra sessions $55 each
                  </span>
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Choose Premium
              </button>
            </div>

            {/* Basic Plan */}
            <div
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '2rem',
                position: 'relative',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
              onClick={basicSelected}
            >
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  Basic
                </h3>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.5rem',
                  }}
                >
                  $14.99
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 'normal',
                      color: '#6b7280',
                    }}
                  >
                    /month
                  </span>
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  35 Day Free Trial
                </div>
              </div>

              <div
                style={{
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      color: '#4b5563',
                      fontSize: '0.9rem',
                    }}
                  >
                    35 day free trial
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      color: '#4b5563',
                      fontSize: '0.9rem',
                    }}
                  >
                    No included sessions
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      color: '#4b5563',
                      fontSize: '0.9rem',
                    }}
                  >
                    Sessions priced separately
                  </span>
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Niche selection page
  if (currentStage === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          paddingTop: 20,
          paddingBottom: 20,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5', // Optional: adds a background color to the page
        }}
      >
        <div
          style={{
            width: '90%',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow:
              '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        >
          <ProgressBar />
          <div
            style={{
              marginBottom: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              Select up to 3 that apply to you:
            </h2>
            {usingTestData && (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: 'rgb(107, 114, 128)',
                }}
              >
                No results found.
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            {uniqueNiches.map(niche => (
              <label
                key={niche}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  ...(selectedNiches.includes(niche)
                    ? {
                        backgroundColor: 'rgb(219, 234, 254)',
                        borderColor: 'rgb(59, 130, 246)',
                        color: 'rgb(29, 78, 216)',
                      }
                    : {
                        backgroundColor: 'white',
                        borderColor: 'rgb(229, 231, 235)',
                        color: 'rgb(55, 65, 81)',
                      }),
                  ...(selectedNiches.length >= 3 &&
                  !selectedNiches.includes(niche)
                    ? {
                        opacity: 0.5,
                        cursor: 'not-allowed',
                      }
                    : {}),
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedNiches.includes(niche)}
                  onChange={() => handleNicheSelection(niche)}
                  disabled={
                    selectedNiches.length >= 3 &&
                    !selectedNiches.includes(niche)
                  }
                  style={{ display: 'none' }}
                />
                <span>{niche}</span>
              </label>
            ))}
          </div>

          <div
            style={{
              fontSize: '0.875rem',
              color: 'rgb(107, 114, 128)',
              marginBottom: 20,
            }}
          >
            Selected: {selectedNiches.length}/3
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {!premiumPurchasedAlready ? (
              <button
                onClick={() => setCurrentStage(-1)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid rgb(209, 213, 219)',
                  borderRadius: '0.25rem',
                  transition: 'background-color 150ms',
                }}
              >
                Back
              </button>
            ) : (
              <div></div> // Empty placeholder to maintain layout
            )}
            <button
              onClick={handleNextFromNiches}
              disabled={selectedNiches.length === 0}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor:
                  selectedNiches.length === 0
                    ? 'rgb(209, 213, 219)'
                    : '#8719e0',
                color: 'white',
                borderRadius: '0.25rem',
                transition: 'background-color 150ms',
                cursor: selectedNiches.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Price selection page
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'auto',
        paddingTop: 20,
        paddingBottom: 20,
        minHeight: '100vh',
        backgroundColor: '#f5f5f5', // Optional: adds a background color to the page
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow:
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        <ProgressBar />
        <div
          style={{
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            What's your preferred price for 1-on-1 sessions?
          </h2>
          {usingTestData && (
            <div
              style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'rgb(107, 114, 128)',
              }}
            >
              No results found.
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {['Affordable', 'Average', 'Premium'].map(price => {
            const displayText = {
              Affordable: 'Affordable: $50/hour and under',
              Average: 'Average: Between $50/hour and $100/hour',
              Premium: 'Premium: $100/hour and over',
            };

            return (
              <label
                key={price}
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="price"
                  value={price}
                  checked={selectedPrice === price}
                  onChange={() => setSelectedPrice(price)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{displayText[price]}</span>
              </label>
            );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => setCurrentStage(0)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid rgb(209, 213, 219)',
              borderRadius: '0.25rem',
              transition: 'background-color 150ms',
            }}
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStage(2)}
            disabled={!selectedPrice}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !selectedPrice
                ? 'rgb(209, 213, 219)'
                : '#8719e0',
              color: 'white',
              borderRadius: '0.25rem',
              transition: 'background-color 150ms',
              cursor: !selectedPrice ? 'not-allowed' : 'pointer',
            }}
          >
            Find My Coach
          </button>
        </div>
      </div>
    </div>
  );
};

const FreeSessionButton = ({ zoomLink, coachPhoto }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleHover = () => {
    setShowConfetti(false); // Reset first to ensure a clean animation
    setTimeout(() => {
      setShowConfetti(true);
    }, 10);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleFreeSessionClick = e => {
    // Check if we're in a React Native WebView
    if (window.ReactNativeWebView) {
      e.preventDefault(); // Prevent default navigation

      console.log('Broadcasting openInBrowser for Zoom link:', zoomLink);

      // Send message to React Native to open in external browser
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'openInBrowser',
          url: zoomLink,
        }),
      );
    }
    // If not in WebView, the default href behavior will handle opening the link
  };

  return (
    <div
      style={{
        position: 'relative',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f8f9ff',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {showConfetti && <Confetti />}

      <img
        src={coachPhoto}
        style={{
          borderRadius: '9999px',
          objectFit: 'cover',
          width: '8rem',
          height: '8rem',
          marginBottom: 10,
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Sparkles
          size={24}
          style={{ color: '#FFD700', marginRight: '0.5rem' }}
        />
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#4338ca',
            margin: 0,
          }}
        >
          Limited Time Offer!
        </h2>
        <Sparkles
          size={24}
          style={{ color: '#FFD700', marginLeft: '0.5rem' }}
        />
      </div>

      <p
        style={{
          fontSize: '1.125rem',
          marginBottom: '1.5rem',
          color: '#4b5563',
        }}
      >
        Unlock your budgeting potential with a{' '}
        <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>
          FREE 30-minute Zoom consultation
        </span>
        . Your coach will help you get started!
      </p>

      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#4b5563',
              margin: 0,
            }}
          >
            Personalized
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#4b5563',
              margin: 0,
            }}
          >
            30-Minutes
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: '#f3e8ff',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '1.5rem', height: '1.5rem', color: '#9333ea' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#4b5563',
              margin: 0,
            }}
          >
            Completely Free
          </p>
        </div>
      </div>

      <a
        href={zoomLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleFreeSessionClick} // Add this onClick handler
        onMouseEnter={handleHover}
        style={{
          display: 'inline-block',
          background: 'linear-gradient(to right, #4f46e5, #9333ea)',
          color: 'white',
          fontWeight: 'bold',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'scale(1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          textDecoration: 'none',
          fontSize: '1.125rem',
        }}
        onMouseOver={e => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
        }}
        onMouseOut={e => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}
      >
        Claim Your Free Session Now
      </a>

      <p
        style={{
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: '#6b7280',
          fontStyle: 'italic',
        }}
      >
        *Limited slots available. No credit card required.
      </p>
    </div>
  );
};

// Confetti animation component
const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random confetti particles
    const colors = ['#FFC700', '#FF0055', '#2BD1FC', '#F19AF7', '#C3FF99'];
    const shapes = ['square', 'circle'];
    const newParticles = [];

    // Create all particles at once with pre-calculated positions for the entire animation
    for (let i = 0; i < 100; i++) {
      const speedX = -1.5 + Math.random() * 3;
      const speedY = 3 + Math.random() * 5;
      const rotation = -1 + Math.random() * 2;
      const frames = [];

      // Pre-calculate 90 frames of animation (approximately 3 seconds at 30fps)
      let x = Math.random() * 100;
      let y = -20 - Math.random() * 30;
      let currentSpeedY = speedY;

      for (let frame = 0; frame < 90; frame++) {
        // Calculate position for this frame
        frames.push({
          x: x,
          y: y,
          opacity: Math.max(0, 1 - y / 120),
          rotation: frame * rotation,
        });

        // Update for next frame
        x += speedX;
        y += currentSpeedY;
        currentSpeedY += 0.1; // Gravity effect
      }

      newParticles.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        frames: frames,
        currentFrame: 0,
      });
    }

    setParticles(newParticles);

    // Animation loop that just increments the current frame instead of recalculating positions
    const animation = setInterval(() => {
      setParticles(currentParticles =>
        currentParticles.map(p => ({
          ...p,
          currentFrame: Math.min(p.currentFrame + 1, p.frames.length - 1),
        })),
      );
    }, 30);

    return () => clearInterval(animation);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {particles.map(p => {
        const frame = p.frames[p.currentFrame];
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              backgroundColor: p.color,
              width: p.size + 'px',
              height: p.size + 'px',
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              top: frame.y + '%',
              left: frame.x + '%',
              transform: `rotate(${frame.rotation}deg)`,
              opacity: frame.opacity,
              transition: 'none',
              willChange: 'transform, top, left, opacity',
            }}
          />
        );
      })}
    </div>
  );
};

export default CoachQuiz;
