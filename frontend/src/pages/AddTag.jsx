import React, { useState } from "react";
import { CreateTag, GetAllTags } from "../api/problemApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTag } from "../store/tagsSlice";
import { handleError, handleSuccess } from "../utils/toastFunctions";

export default function AddTagForm() {

    const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_form: "",
  });

  const tags = useSelector(state=>state.tags.list)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await CreateTag(formData);
        if (res.success){
            handleSuccess(res.message);
            dispatch(addTag(res?.tag))
        }else{
            handleError(res.message)
        }
    } catch (error) {
        handleError(error.message || "Error saving tag")
    }
    setFormData({ name: "", description: "", short_form: "" }); // reset form
  };

  return (
    <div className="max-w-3xl mx-auto p-6 shadow-lg rounded-2xl">
    <div className="max-w-md mx-auto mt-6 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Add New Tag
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tag Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Short Form */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Short Form
          </label>
          <input
            type="text"
            name="short_form"
            value={formData.short_form}
            onChange={handleChange}
            placeholder="(Optional)"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                     text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 
                     focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900"
        >
          Save Tag
        </button>
      </form>
    </div>

    {/* Tags Table */}
      {tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Added Tags
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Short Form
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr
                    key={tag._id}
                    className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 dark:bg-gray-800"
                  >
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{tag.name}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{tag.short_form || "-"}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{tag.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
  );
}
