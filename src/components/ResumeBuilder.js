import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
    },
    summary: '',
    experience: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    education: [{
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: ''
    }],
    skills: ['']
  });

  const resumeRef = useRef(null);

  useEffect(() => {
    // Add print styles when component mounts
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page {
          size: 210mm 297mm;  /* A4 size */
          margin: 20mm;
        }
        
        /* Hide everything except resume preview */
        body * {
          visibility: hidden;
        }
        
        #resume-preview, #resume-preview * {
          visibility: visible;
        }
        
        #resume-preview {
          position: absolute;
          left: 0;
          top: 0;
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          margin: 0;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1d1d1f;
        }

        /* Format text */
        #resume-preview h1 {
          font-size: 24pt;
          font-weight: 300;
          letter-spacing: -0.5pt;
          margin-bottom: 16pt;
        }
        
        #resume-preview h2 {
          font-size: 14pt;
          font-weight: 500;
          margin-bottom: 12pt;
        }
        
        #resume-preview h3 {
          font-size: 12pt;
          font-weight: 500;
        }
        
        #resume-preview p, #resume-preview div {
          font-size: 10pt;
          line-height: 1.5;
          color: #424245;
        }

        /* Ensure links are visible but not blue */
        #resume-preview a {
          color: inherit;
          text-decoration: none;
        }

        /* Hide UI elements during print */
        .no-print, button {
          display: none !important;
        }

        /* Ensure background colors print */
        #resume-preview .bg-gray-50 {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newExperience = [...prev.experience];
      newExperience[index] = {
        ...newExperience[index],
        [name]: value
      };
      return {
        ...prev,
        experience: newExperience
      };
    });
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = {
        ...newEducation[index],
        [name]: value
      };
      return {
        ...prev,
        education: newEducation
      };
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        school: '',
        location: '',
        graduationDate: '',
        gpa: ''
      }]
    }));
  };

  const handleSkillsChange = (index, value) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = value;
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const downloadAsImage = async () => {
    const resumeContent = resumeRef.current;
    if (!resumeContent) return;

    // Use browser's print functionality but modified for image
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Resume</title>');
    
    // Copy styles
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(styleSheet => {
      printWindow.document.head.appendChild(styleSheet.cloneNode(true));
    });
    
    printWindow.document.write('</head><body>');
    printWindow.document.body.appendChild(resumeContent.cloneNode(true));
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  };

  const downloadAsPDF = () => {
    const resumeContent = resumeRef.current;
    if (!resumeContent) return;

    // Use browser's print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Resume</title>');

    // Add print-specific styles
    const style = document.createElement('style');
    style.textContent = `
      @page {
        size: 210mm 297mm;
        margin: 20mm;
      }
      body {
        margin: 0;
        padding: 20mm;
      }
    `;
    printWindow.document.head.appendChild(style);
    
    // Copy existing styles
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(styleSheet => {
      printWindow.document.head.appendChild(styleSheet.cloneNode(true));
    });
    
    printWindow.document.write('</head><body>');
    printWindow.document.body.appendChild(resumeContent.cloneNode(true));
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Wait for resources to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  // ... [Previous handlers remain the same] ...

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resume Builder</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Personal Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.personalInfo.name}
                onChange={handlePersonalInfoChange}
                className="border rounded p-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="border rounded p-2"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className="border rounded p-2"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.personalInfo.location}
                onChange={handlePersonalInfoChange}
                className="border rounded p-2"
              />
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn URL"
                value={formData.personalInfo.linkedin}
                onChange={handlePersonalInfoChange}
                className="border rounded p-2"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Professional Summary</h2>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              className="w-full border rounded p-2 h-32"
              placeholder="Write a brief professional summary..."
            />
          </div>

          {/* Work Experience Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="border rounded p-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="startDate"
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="border rounded p-2"
                    />
                    <input
                      type="text"
                      name="endDate"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="border rounded p-2"
                    />
                  </div>
                </div>
                <textarea
                  name="description"
                  placeholder="Job Description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full border rounded p-2 mt-2 h-24"
                />
              </div>
            ))}
            <button
              onClick={addExperience}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Experience
            </button>
          </div>

          {/* Education Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="degree"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    name="school"
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={edu.location}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    name="graduationDate"
                    placeholder="Graduation Date"
                    value={edu.graduationDate}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    name="gpa"
                    placeholder="GPA (optional)"
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="border rounded p-2"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Education
            </button>
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.skills.map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Skill"
                  value={skill}
                  onChange={(e) => handleSkillsChange(index, e.target.value)}
                  className="border rounded p-2"
                />
              ))}
            </div>
            <button
              onClick={addSkill}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
            >
              Add Skill
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resume Preview</CardTitle>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Download size={20} />
            Save as PDF
          </button>
        </CardHeader>
        <CardContent>
          <div id="resume-preview" ref={resumeRef} className="border p-8">
            {/* Personal Info */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{formData.personalInfo.name}</h1>
              <p>
                {formData.personalInfo.email && formData.personalInfo.email}
                {formData.personalInfo.phone && ` | ${formData.personalInfo.phone}`}
              </p>
              <p>
                {formData.personalInfo.location}
                {formData.personalInfo.linkedin && (
                  <span> | <a href={formData.personalInfo.linkedin} className="text-blue-600 hover:underline">LinkedIn</a></span>
                )}
              </p>
            </div>

            {/* Summary */}
            {formData.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b mb-2">Professional Summary</h2>
                <p>{formData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {formData.experience.some(exp => exp.title || exp.company) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b mb-2">Experience</h2>
                {formData.experience.map((exp, index) => (
                  exp.title || exp.company ? (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between">
                        <strong>{exp.title}</strong>
                        <span>{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div>{exp.company}, {exp.location}</div>
                      <p className="mt-1 job-description text-sm text-gray-600">{exp.description}</p>
                    </div>
                  ) : null
                ))}
              </div>
            )}

            {/* Education */}
            {formData.education.some(edu => edu.degree || edu.school) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b mb-2">Education</h2>
                {formData.education.map((edu, index) => (
                  edu.degree || edu.school ? (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between">
                        <strong>{edu.degree}</strong>
                        <span>{edu.graduationDate}</span>
                      </div>
                      <div>{edu.school}, {edu.location}</div>
                      {edu.gpa && <div>GPA: {edu.gpa}</div>}
                    </div>
                  ) : null
                ))}
              </div>
            )}

            {/* Skills */}
            {formData.skills.some(skill => skill) && (
              <div>
                <h2 className="text-xl font-semibold border-b mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.filter(Boolean).map((skill, index) => (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilder;
