import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import { MdSave } from 'react-icons/md';
import { fetchCountries, fetchCurrencies } from '../../modules/common';
import { fetchStoreSettings, clearSettings } from '../../modules/setting';
import { ParallelLoader } from '../../components/Loader';

const storeSettingValidation = Yup.object().shape({
  name: Yup.string().required('Required'),
  currencyId: Yup.number().required('Required'),
  countryId: Yup.number().required('Required'),
  language: Yup.string().required('Required'),
});

class StoreSettingForm extends Component {
  constructor(props) {
    super(props);

    this.props.dispatch(clearSettings());
  }

  componentDidMount() {
    const { dispatch, storeId } = this.props;

    dispatch(fetchCountries());
    dispatch(fetchCurrencies());
    dispatch(fetchStoreSettings(storeId));
  }

  render() {
    const { storeSettings, currencies, countries, loaded } = this.props;

    return Object.entries(storeSettings).length === 0 &&
      storeSettings.constructor === Object ? (
      <ParallelLoader />
    ) : (
      <Formik
        enableReinitialize
        initialValues={{ ...storeSettings }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
        }}
        validationSchema={storeSettingValidation}
      >
        {({
          values: {
            name = '',
            description = '',
            currencyId = '',
            countryId = '',
            language = '',
            facebook = '',
            twitter = '',
          },
          handleChange,
          handleBlur,
          isSubmitting,
          errors,
          /* and other goodies */
        }) => (
          <Form>
            <Row>
              <Col sm="12">
                <Button
                  type="submit"
                  size="sm"
                  color="primary"
                  className="pull-right"
                  disabled={isSubmitting}
                >
                  <MdSave />
                  &nbsp;
                  <FormattedMessage id="sys.save" />
                </Button>
                <br />
                <br />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Card>
                  <CardHeader>
                    <FormattedMessage id="sys.basicInfo" />
                  </CardHeader>
                  <CardBody>
                    <FormGroup row>
                      <Label for="name" sm={3}>
                        <FormattedMessage id="sys.storeName" />
                        <span className="text-danger mandatory-field">*</span>
                      </Label>
                      <Col sm={9}>
                        <Input
                          name="name"
                          id="name"
                          value={name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <div className="text-danger">{errors.name}</div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="description" sm={3}>
                        <FormattedMessage id="sys.desc" />
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="textarea"
                          name="description"
                          id="description"
                          value={description}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="currencyId" sm={3}>
                        <FormattedMessage id="sys.currency" />
                        <span className="text-danger mandatory-field">*</span>
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="select"
                          name="currencyId"
                          id="currency-id"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={currencyId}
                        >
                          <option value="">--</option>
                          {currencies.map(currency => (
                            <option key={currency.id} value={currency.id}>
                              {currency.name}
                            </option>
                          ))}
                        </Input>
                        <div className="text-danger">{errors.currencyId}</div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="countryId" sm={3}>
                        <FormattedMessage id="sys.country" />
                        <span className="text-danger mandatory-field">*</span>
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="select"
                          name="countryId"
                          id="country-id"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={countryId}
                        >
                          <option value="">--</option>
                          {countries.map(country => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </Input>
                        <div className="text-danger">{errors.countryId}</div>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="language" sm={3}>
                        <FormattedMessage id="sys.lang" />
                        <span className="text-danger mandatory-field">*</span>
                      </Label>
                      <Col sm={9}>
                        <Input
                          type="select"
                          name="language"
                          id="language"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={language}
                        >
                          {[{ id: 'en', name: 'English' }].map(lang => (
                            <option key={lang.id} value={lang.id}>
                              {lang.name}
                            </option>
                          ))}
                        </Input>
                        <div className="text-danger">{errors.language}</div>
                      </Col>
                    </FormGroup>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <CardHeader>
                    <FormattedMessage id="sys.socialMedia" />
                  </CardHeader>
                  <CardBody>
                    <FormGroup row>
                      <Label for="facebook" sm={3}>
                        <FormattedMessage id="sys.facebook" />
                      </Label>
                      <Col sm={9}>
                        <Input
                          name="facebook"
                          id="facebook"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={facebook}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="twitter" sm={3}>
                        <FormattedMessage id="sys.twitter" />
                      </Label>
                      <Col sm={9}>
                        <Input
                          name="twitter"
                          id="twitter"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={twitter}
                        />
                      </Col>
                    </FormGroup>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    );
  }
}

StoreSettingForm.propTypes = {
  storeSettings: PropTypes.object.isRequired,
  storeId: PropTypes.string.isRequired,
  countries: PropTypes.array.isRequired,
  currencies: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
};

export default connect(state => {
  return {
    storeSettings: state.settingReducer.storeSettings,
    loaded: state.categoryReducer.loaded,
    currencies: state.publicReducer.currencies,
    countries: state.publicReducer.countries,
  };
})(StoreSettingForm);
