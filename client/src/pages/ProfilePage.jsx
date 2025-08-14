import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import assets from "../assets/assets";
import { useAppContext } from "../context/AppContext";
const ProfilePage = () => {
  const { navigate, name, setName, bio, setBio, authUser, updateProfile } =
    useAppContext();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({ name, bio });
      navigate("/");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, name, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2
      border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-md"
      >
        <form
          onSubmit={handleSumbit}
          className="flex flex-col gap-5 p-10 flex-1"
          action=""
        >
          <h3 className="tetx-lg text-"> Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              className={`max-w-12 max-h-12 ${selectedImage && "rounded-full"}`}
              alt=""
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none 
            focus:ring-2 focus:ring-violet-500"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            name=""
            id=""
            className="p-2 border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-violet-500"
            row={4}
            required
          ></textarea>
          <button
            className="bg-gradient-to-r from-purple-400 to-violet-600 transition-all 
          text-white w-full py-2 rounded-md cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </form>
        <img
          className={`max-w-44 aspect-square
           rounded-full mx-10 max-sm:mt-10 ${selectedImage && "rounded-full"}`}
          src={authUser?.profilePic || assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfilePage;
