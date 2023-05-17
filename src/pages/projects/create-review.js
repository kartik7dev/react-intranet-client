import { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container,Divider, Input, Stack, TextField, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from 'src/hooks/use-auth';
import axios from '../../api/axios'
const PROJECT_REVIEW_URL = '/project-reviews'
const validFileExtensions = { application: ['pdf'] };

function isValidFileType(fileName, fileType) {
    const fileExtension = fileName.split('.').pop()
    return fileName && fileType.some(category => validFileExtensions[category].includes(fileExtension));
  }

const Page = () => {
    const [categories, setCategories] = useState([])
    const token = localStorage.getItem('token')        
    const auth = useAuth()
    const router = useRouter()
    const userDetails = JSON.parse(auth.user)
    const initialValues = {
          id : '',
          projectId : router.query.pid,
          userId : userDetails?.userId,
          remarks : '',
          description : '', 
          projectReviewDoc : '', 
          reviewParameter1 : 0, 
          reviewParameter2 : 0, 
          reviewParameter3 : 0, 
          reviewParameter4 : 0, 
          reviewParameter5 : 0, 
          reviewTotal : '', 
          reviewedBy : '',
          reviewDate : '', 
          submit: null
    }

      const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
          remarks : Yup
            .string()
            .matches(/^[aA-zZ\s&-.:]+$/, "Only alphabets are allowed for this field")
            .max(255)
            .required('Remarks is required'),
          description : Yup
            .string()
            .matches(/^[aA-zZ\s&-.:]+$/, "Only alphabets are allowed for this field")
            .required('Description is required'),
          reviewParameter1 : Yup
            .number('Only digits allowed')
            .required('Parameter is required'),
          reviewParameter2 : Yup
            .number('Only digits allowed')
            .required('Parameter is required'),
          reviewParameter3 : Yup
            .number('Only digits allowed')
            .required('Parameter is required'),
          reviewParameter4 : Yup
            .number('Only digits allowed')
            .required('Parameter is required'),
          reviewParameter5 : Yup
            .number('Only digits allowed')
            .required('Parameter is required'),
          reviewedBy : Yup
          .string()
          .max('255')
          .required('Reviewed By is required'),     
          reviewDate : Yup
          .date()
          .required('Review Date is required'),     
          projectReviewDoc : Yup
          .mixed()
          .required('Project document is required')
          .test("FILE_FORMAT",
          "Only .pdf files are allowed",
          value => isValidFileType(value && value.name.toLowerCase(), ["application"])
          ),        
        }),
        onSubmit: async (values, helpers) => {
            try {
                // helpers.setSubmitting(true); // Set isSubmitting to true to disable the submit button
                const formData = new FormData();
                // Loop through the values object and append each key-value pair to the FormData
                Object.entries(values).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                const response = await axios.post(PROJECT_REVIEW_URL,
                        formData,
                        {
                        headers: {'Authorization':`Bearer ${token}`},
                        withCredentials : false
                        })
                    // Handle the successful response here (e.g., show success message)
                    router.push({pathname : '/projects',query : {successMsg:response.data.message}},'/projects');     
                //  Create Category   
              } catch (err) {
                // Handle the error here (e.g., show error message)
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.response.data.message });
                helpers.setSubmitting(false);
              } finally {
                helpers.setSubmitting(false); // Set isSubmitting back to false to enable the submit button
              }
        }
      })
  
      
  return <>
    <Head>
      <title>
      Intranet IIRS Dashboard || Add Project Review
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Add Project Review
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={12}
                lg={12}
              >
                    <form
        autoComplete="off"
        noValidate
        onSubmit={formik.handleSubmit}
        >
        <Card>
            <CardHeader
            title="submit your review"
            />
            <CardContent sx={{ pt: 0 }}>
            <Box sx={{ m: -1.5 }}>
                <Grid
                container
                spacing={3}
                >
                <Grid
                    xs={12}
                    md={12}
                >
                    <TextField
                     error={!!(formik.touched.remarks && formik.errors.remarks)}
                     helperText={formik.touched.remarks && formik.errors.remarks}
                      fullWidth
                      label="Remarks"
                      name="remarks"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      required
                      value={formik.values.remarks}
                    />
                </Grid>
                
                <Grid
                      xs={12}
                      md={12}
                    >
                              <TextField
                                error={!!(formik.touched.description && formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                fullWidth
                                label="Description"
                                name="description"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                required
                                multiline
                                rows={4}
                                value={formik.values.description}
                              />
              </Grid>
              <Grid
                      xs={12}
                      md={12}
                    >
              <TextField
                            fullWidth
                            error={!!(formik.touched.projectReviewDoc && formik.errors.projectReviewDoc)}
                            helperText={formik.touched.projectReviewDoc && formik.errors.projectReviewDoc}
                            label="Upload File"
                            name="projectReviewDoc"
                            type="file"
                            onChange={(event) => { console.log(event.target.files[0]); formik.setFieldValue("projectReviewDoc", event.target.files[0])}}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            InputProps={{
                            inputProps: {
                                accept: 'application/*', // Set the accepted file types if needed
                            },
                           
                            }}
                        onBlur={formik.handleBlur}
                    />
                    </Grid>
                    <Grid
                      xs={12}
                      md={2}
                    >
                      <TextField
                     error={!!(formik.touched.reviewParameter1 && formik.errors.reviewParameter1)}
                     helperText={formik.touched.reviewParameter1 && formik.errors.reviewParameter1}
                      fullWidth
                      label="Parameter 1"
                      name="reviewParameter1"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.handleChange(event)
                        const total = parseInt(event.target.value) + parseInt(formik.values.reviewParameter2) + parseInt(formik.values.reviewParameter3) + parseInt(formik.values.reviewParameter4) + parseInt(formik.values.reviewParameter5);
                        formik.setFieldValue('reviewTotal',total)
                      }
                    }
                      required
                      value={formik.values.reviewParameter1}
                    />
                      </Grid>
                    <Grid
                      xs={12}
                      md={2}
                    >
                      <TextField
                     error={!!(formik.touched.reviewParameter2 && formik.errors.reviewParameter2)}
                     helperText={formik.touched.reviewParameter2 && formik.errors.reviewParameter2}
                      fullWidth
                      label="Parameter 2"
                      name="reviewParameter2"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.handleChange(event)
                        const total = parseInt(event.target.value) + parseInt(formik.values.reviewParameter1) + parseInt(formik.values.reviewParameter3) + parseInt(formik.values.reviewParameter4) + parseInt(formik.values.reviewParameter5);
                        formik.setFieldValue('reviewTotal',total)
                      }
                    }
                      required
                      value={formik.values.reviewParameter2}
                    />
                      </Grid>
                    <Grid
                      xs={12}
                      md={2}
                    >
                      <TextField
                     error={!!(formik.touched.reviewParameter3 && formik.errors.reviewParameter3)}
                     helperText={formik.touched.reviewParameter3 && formik.errors.reviewParameter3}
                      fullWidth
                      label="Parameter 3"
                      name="reviewParameter3"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.handleChange(event)
                        const total = parseInt(event.target.value) + parseInt(formik.values.reviewParameter2) + parseInt(formik.values.reviewParameter1) + parseInt(formik.values.reviewParameter4) + parseInt(formik.values.reviewParameter5);
                        formik.setFieldValue('reviewTotal',total)
                      }
                    }
                      required
                      value={formik.values.reviewParameter3}
                    />
                      </Grid>
                    <Grid
                      xs={12}
                      md={2}
                    >
                      <TextField
                     error={!!(formik.touched.reviewParameter4 && formik.errors.reviewParameter4)}
                     helperText={formik.touched.reviewParameter4 && formik.errors.reviewParameter4}
                      fullWidth
                      label="Parameter 4"
                      name="reviewParameter4"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.handleChange(event)
                        const total = parseInt(event.target.value) + parseInt(formik.values.reviewParameter2) + parseInt(formik.values.reviewParameter3) + parseInt(formik.values.reviewParameter1) + parseInt(formik.values.reviewParameter5);
                        formik.setFieldValue('reviewTotal',total)
                      }
                    }
                      required
                      value={formik.values.reviewParameter4}
                    />
                      </Grid>
                    <Grid
                      xs={12}
                      md={2}
                    >
                      <TextField
                     error={!!(formik.touched.reviewParameter5 && formik.errors.reviewParameter5)}
                     helperText={formik.touched.reviewParameter5 && formik.errors.reviewParameter5}
                      fullWidth
                      label="Parameter 5"
                      name="reviewParameter5"
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.handleChange(event)
                        const total = parseInt(event.target.value) + parseInt(formik.values.reviewParameter2) + parseInt(formik.values.reviewParameter3) + parseInt(formik.values.reviewParameter4) + parseInt(formik.values.reviewParameter1);
                        formik.setFieldValue('reviewTotal',total)
                      }
                    }
                      required
                      value={formik.values.reviewParameter5}
                    />
                      </Grid>
                    <Grid
                      xs={12}
                      md={2}
                    >
                      <TextField
                     error={!!(formik.touched.reviewTotal && formik.errors.reviewTotal)}
                     helperText={formik.touched.reviewTotal && formik.errors.reviewTotal}
                      fullWidth
                      label="Parameter Total"
                      name="reviewTotal"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.reviewTotal}
                      readOnly
                    />
                      </Grid>

                      <Grid xs={12} md={12}>
                      <TextField
                          error={!!(formik.touched.reviewDate && formik.errors.reviewDate)}
                          helperText={formik.touched.reviewDate && formik.errors.reviewDate}
                          fullWidth
                          label="Review Date"
                          name="reviewDate"
                          type="date"
                          value={formik.values.reviewDate}
                          InputLabelProps={{
                            shrink: true,
                            }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          required
                      />
                      </Grid>

                      <Grid
                    xs={12}
                    md={12}
                >
                    <TextField
                     error={!!(formik.touched.reviewedBy && formik.errors.reviewedBy)}
                     helperText={formik.touched.reviewedBy && formik.errors.reviewedBy}
                      fullWidth
                      label="Reviewed By"
                      name="reviewedBy"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      required
                      value={formik.values.reviewedBy}
                    />
                </Grid>
                        
                </Grid>
            </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
                Save details
            </Button>
            </CardActions>
        </Card>
        </form>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;