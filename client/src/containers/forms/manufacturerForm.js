import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Alert,
} from 'reactstrap';
import { MdSave } from 'react-icons/md';
import {
  fetchCountries,
  submitManufacturer,
  fetchManufacturerDetails,
  clearManufacturerDetails,
  uploadFile,
} from '../../actions';
import { ProfileLoader } from '../../components';
import config from '../../config';

const {
  mediaFileDomain,
  saveMediaFileLocal,
} = config;
const required = value => (value ? undefined : 'Required');

const renderField = ({
  input,
  placeholder,
  type,
  meta: { touched, error },
}) => (
    <div>
      <Input {...input} placeholder={placeholder} type={type} />
      {touched && (error && <span className="text-danger">{error}</span>)}
    </div>
  );

const renderSelect = ({ input, data, meta: { touched, error } }) => (
  <div>
    <select {...input} className="form-control">
      <option />
      {data.map(item => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
    {touched && (error && <div><span className="text-danger">{error}</span></div>)}
  </div>
);

class ManufacturerForm extends Component {
  constructor(props) {
    super(props);

    this.props.dispatch(
      clearManufacturerDetails()
    );
  }

  componentDidMount() {
    const {
      dispatch,
      mode,
      storeId,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch(fetchCountries());

    if (mode === 'update') {
      dispatch(
        fetchManufacturerDetails({ storeId, manufacturerId: id })
      );
    }
  }

  onSubmit = data => {
    const {
      dispatch,
      storeId,
      mode,
      uploadedFile,
      match: {
        params: { id },
      },
    } = this.props;

    data.storeId = storeId;
    data.mode = mode;

    if (mode === 'update') {
      data.manufacturerId = id;
    }

    if (uploadedFile) {
      data.logo = uploadedFile.path;
    }

    dispatch(submitManufacturer(data));
  };

  handleUpload = event => {
    const { dispatch } = this.props;

    dispatch(uploadFile(event.target.files[0]));
  }

  render() {
    const {
      handleSubmit,
      manufacturerDetails,
      countries,
      uploadedFile,
      mode,
      error,
      done,
    } = this.props;

    let logo = null;

    if (manufacturerDetails.logo) {
      logo = `${manufacturerDetails.logo.indexOf('http') !== -1 ? '' : mediaFileDomain + '/'}${manufacturerDetails.logo}`;
    }

    if (uploadedFile && saveMediaFileLocal) {
      logo = `${mediaFileDomain}/${uploadedFile.path}`;
    }

    return (
      mode === 'update' && !('code' in manufacturerDetails) ?
        <ProfileLoader /> :
        <Form onSubmit={handleSubmit(data => this.onSubmit(data))}>
          <Button size="sm" color="primary" className="pull-right form-btn">
            <MdSave />
            &nbsp;
            <FormattedMessage id="sys.save" />
          </Button>
          <br />
          <br />
          {
            error ?
              <Alert color="danger">
                <FormattedMessage id="sys.newFailed" />
              </Alert> :
              done ?
                <Alert color="success">
                  <FormattedMessage id="sys.newSuccess" />
                </Alert> : null
          }

          <Row>
            <Col md={4}>
              <p className="lead"><FormattedMessage id="sys.logo" /></p>
              <img
                src={logo || require('../../assets/no_image.svg')}
                className="logo-lg"
              /><br /><br />
              {
                saveMediaFileLocal ?
                  <input
                    type="file"
                    name="logo"
                    id="logo"
                    onChange={this.handleUpload}
                  /> :
                  <div>
                    <FormattedMessage id="sys.pasteImageUrl" /><br />

                    <Field
                      component={renderField}
                      name="logo"
                      className="form-control"
                      id="logo"
                    />
                  </div>
              }
            </Col>
            <Col md={8}>
              <Card>
                <CardHeader>
                  <FormattedMessage id="sys.basicInfo" />
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Label for="name" sm={3}>
                      <FormattedMessage id="sys.name" />
                      <span className="text-danger mandatory-field">*</span>
                    </Label>
                    <Col sm={9}>
                      <Field
                        component={renderField}
                        name="name"
                        className="form-control"
                        id="name"
                        validate={[required]}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="url" sm={3}>
                      <FormattedMessage id="sys.website" />
                    </Label>
                    <Col sm={9}>
                      <Field
                        component={renderField}
                        name="url"
                        className="form-control"
                        id="url"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="email" sm={3}>
                      <FormattedMessage id="sys.email" />
                    </Label>
                    <Col sm={9}>
                      <Field
                        component={renderField}
                        name="email"
                        className="form-control"
                        id="email"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="contact" sm={3}>
                      <FormattedMessage id="sys.contactNo" />
                      <span className="text-danger mandatory-field">*</span>
                    </Label>
                    <Col sm={9}>
                      <Field
                        component={renderField}
                        name="contact"
                        className="form-control"
                        id="contact"
                        validate={[required]}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="country-id" sm={3}>
                      <FormattedMessage id="sys.country" />
                      <span className="text-danger mandatory-field">*</span>
                    </Label>
                    <Col sm={9}>
                      <Field
                        component={renderSelect}
                        name="countryId"
                        id="country-id"
                        data={countries}
                        validate={[required]}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="address" sm={3}>
                      <FormattedMessage id="sys.address" />
                      <span className="text-danger mandatory-field">*</span>
                    </Label>
                    <Col sm={9}>
                      <Field
                        component={renderField}
                        name="address"
                        className="form-control"
                        id="address"
                        validate={[required]}
                      />
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
    );
  }
}

ManufacturerForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  manufacturerDetails: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
  mode: PropTypes.string.isRequired,
  error: PropTypes.bool,
  done: PropTypes.bool.isRequired,
  storeId: PropTypes.string.isRequired,
  countries: PropTypes.array.isRequired,
  uploadedFile: PropTypes.object,
};

ManufacturerForm = reduxForm({
  form: 'manufacturerForm',
})(ManufacturerForm);

export default withRouter(
  connect(state => {
    return {
      initialValues: state.manufacturerReducer.manufacturerDetails,
      manufacturerDetails: state.manufacturerReducer.manufacturerDetails,
      countries: state.publicReducer.countries,
      uploadedFile: state.publicReducer.uploadedFile,
      done: state.manufacturerReducer.done,
      error: state.manufacturerReducer.error,
      enableReinitialize: true,
    };
  })(ManufacturerForm)
);
