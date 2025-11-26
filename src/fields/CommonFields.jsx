export default function CommonFields({
  collegeName,
  setCollegeName,
  logo,
  handleLogoUpload,
}) {
  return (
    <>
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          College Name
        </label>
        <input
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          placeholder="Enter college name"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-8">
        <label className="block font-semibold mb-2 text-gray-700">
          Upload College Logo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="block w-full p-2 border rounded-lg"
        />

        {logo && (
          <img
            src={logo}
            alt="Logo preview"
            className="w-32 mt-4 rounded border shadow-sm"
          />
        )}
      </div>
    </>
  );
}
