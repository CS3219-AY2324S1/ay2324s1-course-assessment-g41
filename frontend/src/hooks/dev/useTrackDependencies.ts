import { useEffect, useRef } from "react";

/**
 * Hook to track changes in dependencies.
 * @param {string} name - A name to identify the hook in logs.
 * @param {Array} dependencies - An array of dependencies to track.
 */
const useTrackDependencies = <T extends ReadonlyArray<any>>(name: string, dependencies: T) => {
  // Keeping the initial render reference
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      console.log(`${name}: Mounted with`, dependencies);
      isInitialMount.current = false;
    } else {
      console.log(`${name}: Updated with`, dependencies);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
};

export default useTrackDependencies;
