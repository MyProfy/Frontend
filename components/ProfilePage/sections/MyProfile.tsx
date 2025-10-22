import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaBriefcase, FaCalendar, FaEdit } from "react-icons/fa";
import { MdOutlinePhoneBluetoothSpeaker } from "react-icons/md";
import { getAPIClient } from "@/components/types/apiClient";
import { User } from "@/components/types/apiTypes";

const MyProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    region: "",
    work_experience: "",
    birthday: "",
    email: "",
    telegram_username: ""
  });

  const apiClient = getAPIClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Загрузка данных пользователя с бэкенда...");

        const user = await apiClient.getCurrentUser();
        setUserData(user);
        setAboutText(user.about_user || "");

        setFormData({
          name: user.name || "",
          gender: user.gender || "",
          region: user.region || "",
          work_experience: user.work_experience?.toString() || "",
          birthday: user.birthday || "",
          email: user.email || "",
          telegram_username: user.telegram_username || ""
        });

        console.log("✅ Данные пользователя загружены с бэкенда:", user);
      } catch (error: any) {
        console.error("❌ Ошибка загрузки данных пользователя:", error);
        if (error.message === "User data not found in localStorage") {
          alert("Пожалуйста, войдите в систему");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveAbout = async () => {
    if (!userData) return;

    try {
      setSaving(true);
      console.log("💾 Сохранение описания...");

      const updateData = {
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        region: userData.region || "Ташкент",
        gender: userData.gender,
        work_experience: userData.work_experience || 0,
        birthday: userData.birthday,
        email: userData.email,
        telegram_username: userData.telegram_username,
        about_user: aboutText, 
      };

      const updatedUser = await apiClient.updateProfile(userData.id, updateData);
      setUserData(updatedUser);
      console.log("✅ Описание сохранено");
    } catch (error: any) {
      console.error("❌ Ошибка сохранения описания:", error);
      alert(`Ошибка при сохранении: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userData) return;

    try {
      setSaving(true);
      console.log("💾 Сохранение профиля...", formData);

      
      const updateData = {
        name: formData.name || userData.name,
        phone: userData.phone, 
        role: userData.role, 
        region: formData.region || userData.region || "Ташкент",
        gender: formData.gender || userData.gender,
        work_experience: formData.work_experience ? parseInt(formData.work_experience) : userData.work_experience || 0,
        birthday: formData.birthday || userData.birthday,
        email: formData.email || userData.email,
        telegram_username: formData.telegram_username || userData.telegram_username,
        about_user: userData.about_user, 
      };

      const updatedUser = await apiClient.updateProfile(userData.id, updateData);
      setUserData(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        gender: updatedUser.gender || "",
        region: updatedUser.region || "",
        work_experience: updatedUser.work_experience?.toString() || "",
        birthday: updatedUser.birthday || "",
        email: updatedUser.email || "",
        telegram_username: updatedUser.telegram_username || ""
      });

      setShowModal(false);
      console.log("✅ Профиль сохранен:", updatedUser);
    } catch (error: any) {
      console.error("❌ Ошибка сохранения профиля:", error);
      alert(`Ошибка при сохранении: ${error.response?.data?.detail || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 flex justify-center items-center h-40">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <p className="text-gray-600">Не удалось загрузить данные пользователя</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Войти
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-8 md:p-6 sm:p-5 flex items-start justify-between gap-5 flex-col md:flex-col lg:flex-row">
          <div className="flex gap-5 flex-1 w-full">
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                  {userData?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2 leading-tight">
                {userData?.name || "Не указано"}
              </h1>
              <div className="flex items-center gap-5 text-gray-500 text-sm flex-wrap gap-y-3">
                <div className="flex items-center gap-1.5">
                  <FaBriefcase className="w-3.5 h-3.5" />
                  <span>{userData?.gender === 'male' ? 'Мужской' : userData?.gender === 'female' ? 'Женский' : 'Не указано'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="w-3.5 h-3.5" />
                  <span>{userData?.region || 'Регион не указан'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MdOutlinePhoneBluetoothSpeaker className="w-3.5 h-3.5" />
                  <span>{userData?.phone || 'Телефон не указан'}</span>
                </div>
                {userData?.work_experience && userData.work_experience > 0 && (
                  <div className="flex items-center gap-1.5">
                    <FaCalendar className="w-3.5 h-3.5" />
                    <span>Опыт: {userData.work_experience} лет</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3EA240] text-white rounded-lg text-sm font-medium whitespace-nowrap hover:bg-[#369e38] transition-colors"
          >
            <FaEdit className="w-4 h-4" />
            Изменить данные
          </motion.button>
        </div>

        <div className="px-6 pb-6 border-t border-gray-200 mt-6 sm:px-4 sm:pb-4 sm:mt-4">
          <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">О себе</h2>
          <div className="text-gray-500 text-sm leading-relaxed p-4 bg-gray-50 rounded-lg">
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Расскажите о себе..."
              className="w-full bg-transparent border-none outline-none placeholder:text-gray-400 resize-none min-h-[100px]"
            />
          </div>
          <button
            onClick={handleSaveAbout}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3EA240] text-white rounded-md text-xs mt-3 hover:bg-[#369e38] transition-colors disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : '✓ Сохранить изменения'}
          </button>
        </div>
      </motion.section>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                  Изменить данные
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Имя
                    </label>
                    <input
                      type="text"
                      placeholder="Введите имя"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Введите email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telegram
                    </label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={formData.telegram_username}
                      onChange={(e) => handleInputChange('telegram_username', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Дата рождения
                    </label>
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Выберите пол
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    >
                      <option value="">Выберите пол</option>
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Выберите регион
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    >
                      <option value="">Выберите регион</option>
                      <option value="Республика Каракалпакстан">Республика Каракалпакстан</option>
                      <option value="Ташкент">Ташкент</option>
                      <option value="Самарканд">Самарканд</option>
                      <option value="Бухара">Бухара</option>
                      <option value="Андижан">Андижан</option>
                      <option value="Наманган">Наманган</option>
                      <option value="Фергана">Фергана</option>
                      <option value="Навои">Навои</option>
                      <option value="Хорезм">Хорезм</option>
                      <option value="Сурхандарья">Сурхандарья</option>
                      <option value="Сырдарья">Сырдарья</option>
                      <option value="Джизак">Джизак</option>
                      <option value="Кашкадарья">Кашкадарья</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Опыт работы (лет)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.work_experience}
                      onChange={(e) => handleInputChange('work_experience', e.target.value)}
                      min="0"
                      max="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 placeholder:text-gray-400"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full py-3.5 bg-[#3EA240] text-white rounded-lg text-base font-medium hover:bg-green-600 transition-colors mt-2 disabled:opacity-50"
                  >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyProfile;