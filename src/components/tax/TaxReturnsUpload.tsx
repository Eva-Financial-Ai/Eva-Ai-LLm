import React from 'react';

export interface TaxReturn {
  id: string;
  year: string;
  type: 'business' | 'personal';
  ownerId?: string;
  ownerName?: string;
  fileName: string;
  fileUrl: string;
  dateUploaded: string;
  fileSize: number;
}

export interface BusinessTaxReturnsState {
  year1: boolean;
  year2: boolean;
  year3: boolean;
  files: TaxReturn[];
}

export interface OwnerTaxReturnsState {
  id: string;
  name: string;
  email?: string;
  ownershipPercentage: number;
  year1: boolean;
  year2: boolean;
  year3: boolean;
  files: TaxReturn[];
  notificationSent?: boolean;
}

interface TaxReturnsUploadProps {
  businessTaxReturns: BusinessTaxReturnsState;
  ownerTaxReturns: OwnerTaxReturnsState[];
  onBusinessTaxReturnsChange: (data: BusinessTaxReturnsState) => void;
  onOwnerTaxReturnsChange: (ownerId: string, data: Partial<OwnerTaxReturnsState>) => void;
  onUploadBusinessTaxReturn: (files: FileList) => void;
  onUploadOwnerTaxReturn: (ownerId: string, files: FileList) => void;
  onSendNotificationToOwner: (ownerId: string) => void;
}

const TaxReturnsUpload: React.FC<TaxReturnsUploadProps> = ({
  businessTaxReturns,
  ownerTaxReturns,
  onBusinessTaxReturnsChange,
  onOwnerTaxReturnsChange,
  onUploadBusinessTaxReturn,
  onUploadOwnerTaxReturn,
  onSendNotificationToOwner,
}) => {
  const businessFileInputRef = React.useRef<HTMLInputElement>(null);
  const ownerFileInputRefs = React.useRef<{ [key: string]: HTMLInputElement | null }>({});

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Business Tax Returns Section */}
      <div className="bg-white p-4 rounded-md border border-light-border mb-6">
        <h3 className="text-lg font-medium mb-4 text-light-text">Business Tax Returns</h3>

        <div className="mb-4">
          <p className="text-sm text-light-text-secondary mb-3">
            Please select which years of business tax returns you will be providing.
          </p>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={businessTaxReturns.year1}
                onChange={e =>
                  onBusinessTaxReturnsChange({
                    ...businessTaxReturns,
                    year1: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <span className="text-sm text-light-text">
                Most Recent Tax Year ({currentYear - 1})
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={businessTaxReturns.year2}
                onChange={e =>
                  onBusinessTaxReturnsChange({
                    ...businessTaxReturns,
                    year2: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <span className="text-sm text-light-text">Prior Tax Year ({currentYear - 2})</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={businessTaxReturns.year3}
                onChange={e =>
                  onBusinessTaxReturnsChange({
                    ...businessTaxReturns,
                    year3: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <span className="text-sm text-light-text">Two Years Prior ({currentYear - 3})</span>
            </label>
          </div>
        </div>

        {businessTaxReturns.files.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-light-text">Uploaded Tax Returns</h4>
            <div className="border border-light-border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-light-border">
                <thead className="bg-light-bg-alt">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">
                      Date Uploaded
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-light-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-light-border">
                  {businessTaxReturns.files.map(file => (
                    <tr key={file.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-light-text">
                        {file.fileName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-light-text">{file.year}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-light-text">
                        {new Date(file.dateUploaded).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <button
                          type="button"
                          className="text-primary-600 hover:text-primary-800 mr-4"
                          onClick={() => {
                            window.open(file.fileUrl, '_blank');
                          }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="text-risk-red hover:text-risk-red-dark"
                          onClick={() => {
                            onBusinessTaxReturnsChange({
                              ...businessTaxReturns,
                              files: businessTaxReturns.files.filter(f => f.id !== file.id),
                            });
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="border border-dashed border-light-border rounded-md p-4 text-center mb-2">
          <svg
            className="h-10 w-10 mx-auto text-light-text-secondary mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-light-text-secondary mb-3">
            Drag and drop business tax returns here, or click to browse
          </p>
          <input
            type="file"
            ref={businessFileInputRef}
            multiple
            style={{ display: 'none' }}
            onChange={e => e.target.files && onUploadBusinessTaxReturn(e.target.files)}
            accept=".pdf"
          />
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-light-border rounded-md shadow-sm text-sm font-medium text-light-text bg-white hover:bg-light-bg"
            onClick={() => businessFileInputRef.current?.click()}
          >
            Upload Business Tax Returns
          </button>
          <p className="text-xs text-light-text-secondary mt-2">
            Upload complete tax returns including all schedules (PDF format)
          </p>
        </div>
      </div>

      {/* Owner Tax Returns Section */}
      <div className="bg-white p-4 rounded-md border border-light-border mb-6">
        <h3 className="text-lg font-medium mb-4 text-light-text">Owner Personal Tax Returns</h3>

        <p className="text-sm text-light-text-secondary mb-4">
          Each owner with 20% or greater ownership must provide personal tax returns. Each owner
          will upload their own tax returns.
        </p>

        <div className="space-y-6">
          {ownerTaxReturns.map(owner => (
            <div key={owner.id} className="border border-light-border rounded-md p-4">
              <h4 className="text-md font-medium mb-2 text-light-text">
                {owner.name}
                <span className="text-sm font-normal text-light-text-secondary ml-2">
                  ({owner.ownershipPercentage}% ownership)
                </span>
              </h4>

              <div className="mb-3">
                <p className="text-sm text-light-text-secondary mb-2">
                  Select which years of personal tax returns will be provided:
                </p>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={owner.year1}
                      onChange={e => onOwnerTaxReturnsChange(owner.id, { year1: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-light-text">
                      Most Recent Tax Year ({currentYear - 1})
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={owner.year2}
                      onChange={e => onOwnerTaxReturnsChange(owner.id, { year2: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-light-text">
                      Prior Tax Year ({currentYear - 2})
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={owner.year3}
                      onChange={e => onOwnerTaxReturnsChange(owner.id, { year3: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-light-text">
                      Two Years Prior ({currentYear - 3})
                    </span>
                  </label>
                </div>
              </div>

              {owner.files.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2 text-light-text">Uploaded Tax Returns</h5>
                  <div className="border border-light-border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-light-border">
                      <thead className="bg-light-bg-alt">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">
                            File Name
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">
                            Year
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">
                            Date Uploaded
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-light-text-secondary uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-light-border">
                        {owner.files.map(file => (
                          <tr key={file.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-light-text">
                              {file.fileName}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-light-text">
                              {file.year}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-light-text">
                              {new Date(file.dateUploaded).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right">
                              <button
                                type="button"
                                className="text-primary-600 hover:text-primary-800 mr-4"
                                onClick={() => {
                                  window.open(file.fileUrl, '_blank');
                                }}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                className="text-risk-red hover:text-risk-red-dark"
                                onClick={() => {
                                  onOwnerTaxReturnsChange(owner.id, {
                                    files: owner.files.filter(f => f.id !== file.id),
                                  });
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="border border-dashed border-light-border rounded-md p-4 text-center">
                <p className="text-sm text-light-text-secondary mb-2">
                  Drag and drop personal tax returns here, or click to browse
                </p>
                <input
                  type="file"
                  ref={(el: HTMLInputElement | null) => {
                    ownerFileInputRefs.current[owner.id] = el;
                  }}
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => e.target.files && onUploadOwnerTaxReturn(owner.id, e.target.files)}
                  accept=".pdf"
                />
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-light-border rounded-md shadow-sm text-sm font-medium text-light-text bg-white hover:bg-light-bg"
                  onClick={() => ownerFileInputRefs.current[owner.id]?.click()}
                >
                  Upload Personal Tax Returns
                </button>
                <p className="text-xs text-light-text-secondary mt-2">
                  {owner.email
                    ? `The owner will be contacted at ${owner.email} to upload their tax returns directly.`
                    : 'Upload complete tax returns including all schedules (PDF format)'}
                </p>
              </div>

              {/* Notification status */}
              {owner.email && (
                <div className="mt-3">
                  {owner.notificationSent ? (
                    <div className="p-2 rounded-md bg-green-50 text-green-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">Notification sent to owner</span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-md bg-yellow-50 text-yellow-800 flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm">Owner has not been notified yet</span>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => onSendNotificationToOwner(owner.id)}
                      >
                        Send Notification
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TaxReturnsUpload;
