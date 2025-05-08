describe('Basic Test Suite', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });

  it('verifies true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('verifies false is falsy', () => {
    expect(false).toBeFalsy();
  });
}); 