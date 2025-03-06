export default function IncomePage() {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-200 p-4">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500">MY BALANCE</p>
            <p className="text-2xl font-bold text-blue-700">$ 0,0030</p>
          </div>
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500">MONEY IN SAFE</p>
            <p className="text-2xl font-bold text-green-700">$ 0,0000</p>
          </div>
          <nav>
            <ul className="space-y-3">
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                SURFING
              </li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                TASKS
              </li>
            </ul>
            <p className="mt-8 mb-4 text-gray-500 font-semibold">MY JOB</p>
            <ul className="space-y-3">
              <li className="text-red-500 font-semibold cursor-pointer">ALL AVAILABLE TASKS</li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                FAVORITE
              </li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                TAKEN TO WORK
              </li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                PENDING VERIFICATION
              </li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                IMPROVEMENT NEEDED
              </li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                REP. IMPLEMENT
              </li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                PAID
              </li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                REJECTED
              </li>
              <li className="text-gray-700 font-semibold hover:text-green-700 cursor-pointer">
                TRASH CAN
              </li>
            </ul>
          </nav>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 p-8 bg-white">
          <div className="bg-gray-100 border border-gray-300 rounded p-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">Please clarify the information</h2>
            <p className="text-gray-600 mb-4">
              Please state your country of location honestly and accurately. This is necessary for
              the correct issuance of tasks available for fulfillment. You can specify your country
              only once. Afterwards it will be possible to change the country of location only through
              the technical support service. Incorrect specification of the country can be the reason
              for blocking the functionality of the executor.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
              SPECIFY COUNTRY IN PROFILE
            </button>
          </div>
        </main>
      </div>
    );
  }
  