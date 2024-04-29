import React from 'react';
import Link from 'next/link';
import AccordionItem from '../accordion/accordion-item';
import { accountFaq, termsAndConditionsFAQ } from '@/constants';

const FaqArea = () => {
  return (
    <section className="faq-section position-relative pt-100 lg-pt-80">
      <div className="container">
        <ul
          className="nav nav-tabs border-0 justify-content-center"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#fc1"
              role="tab"
            >
              All
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#fc6"
              role="tab"
            >
              {' '}
              Terms & Conditions
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#fc7"
              role="tab"
            >
              Account
            </button>
          </li>
        </ul>
        <div className="bg-wrapper mt-60 lg-mt-40">
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" role="tabpanel" id="fc1">
              <div className="accordion accordion-style-two" id="accordionTwo">
                {[...accountFaq, ...termsAndConditionsFAQ].map((faq, index) => (
                  <AccordionItem
                    key={index}
                    id={`question-${index}`}
                    title={faq.question}
                    desc={faq.answer}
                    parent="accordionTwo"
                  />
                ))}
              </div>
            </div>

            <div className="tab-pane fade" role="tabpanel" id="fc6">
              <div
                className="accordion accordion-style-two"
                id="accordionSeven"
              >
                {termsAndConditionsFAQ.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    id={`question-${index}`}
                    title={faq.question}
                    desc={faq.answer}
                    parent="accordionSeven"
                  />
                ))}
              </div>
            </div>

            <div className="tab-pane fade" role="tabpanel" id="fc7">
              <div
                className="accordion accordion-style-two"
                id="accordionEight"
              >
                {accountFaq.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    id={`question-${index}`}
                    title={faq.question}
                    desc={faq.answer}
                    parent="accordionEight"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center border-bottom pb-150 lg-pb-50 mt-60 lg-mt-40 wow fadeInUp">
          <div className="title-three mb-30">
            <h2 className="fw-normal">Don’t get your answer?</h2>
          </div>
          <Link href="/contact" className="btn-one">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqArea;
